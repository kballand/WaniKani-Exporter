import { AxiosResponse } from "axios";
import { plainToClassFromExist } from "class-transformer";
import { requestUrl } from "../helpers/helper";
import { Collection } from "../responses/collection";
import { Subject, SubjectContent } from "./subject";

export class Kanji extends Subject<KanjiContent> {
    object: "kanji";

    toCSV() {
        let csv: string = this.data.characters;
        csv += ";" + this.data.meanings.map((m) => m.meaning).join(",");
        let onyomi: string[] = [];
        let kunyomi: string[] = [];
        this.data.readings.forEach((reading) => {
            if (reading.type === 'onyomi') {
                onyomi.push(reading.reading);
            } else if (reading.type == 'kunyomi') {
                kunyomi.push(reading.reading);
            }
        });
        csv += ";" + onyomi.join(",");
        csv += ";" + kunyomi.join(",");
        csv += ";" + this.data.level;
        return csv;
    }

    static getAllKanji(): Promise<Collection<Kanji>> {
        return new Promise<Collection<Kanji>>((resolve, reject) => {
            const apiEndpointPath = 'https://api.wanikani.com/v2/subjects?types=kanji';
            requestUrl(apiEndpointPath)
                .then((axiosResponse: AxiosResponse<unknown>) => {
                    let collection = plainToClassFromExist(new Collection<Kanji>(Kanji), axiosResponse.data);
                    collection.combinePages()
                        .then(collectionsCombined => {
                            collectionsCombined.sort((a, b) => {
                                if (a.data.level != b.data.level) {
                                    return a.data.level - b.data.level;
                                } else {
                                    return a.id - b.id;
                                }
                            });
                            resolve(collectionsCombined);
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    static getKanjis(ids: number[]): Promise<Collection<Kanji>> {
        return new Promise<Collection<Kanji>>((resolve, reject) => {
            const apiEndpointPath = `https://api.wanikani.com/v2/subjects?ids=${ids.join()}&types=kanji`;
            requestUrl(apiEndpointPath)
                .then((axiosResponse: AxiosResponse<unknown>) => {
                    let collection = plainToClassFromExist(new Collection<Kanji>(Kanji), axiosResponse.data);
                    collection.combinePages()
                        .then(collectionsCombined => {
                            collectionsCombined.sort((a, b) => {
                                if (a.data.level != b.data.level) {
                                    return a.data.level - b.data.level;
                                } else {
                                    return a.id - b.id;
                                }
                            });
                            resolve(collectionsCombined);
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }
}

export interface KanjiContent extends SubjectContent {
    amalgamation_subject_ids: number[],
    component_subject_ids: number[],
    reading_mnemonic?: string,
    meaning_hint?: string,
    reading_hint?: string,
    readings: KanjiReading[],
    visually_similar_subjects_ids: number[]
}

export interface KanjiReading {
    reading: string,
    primary: boolean,
    accepted_answer: boolean,
    type: KanjiReadingType
}

export type KanjiReadingType = 'kunyomi' | 'onyomi';