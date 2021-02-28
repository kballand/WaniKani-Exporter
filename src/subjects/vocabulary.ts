import { AxiosResponse } from "axios";
import { plainToClassFromExist } from "class-transformer";
import { requestUrl } from "../helpers/helper";
import { Collection } from "../responses/collection";
import { Subject, SubjectContent } from "./subject";

export class Vocabulary extends Subject<VocabularyContent> {
    object: 'vocabulary';

    toCSV() {
        let csv: string = this.data.characters;
        csv += ";" + this.data.meanings.map((m) => m.meaning).join(",");
        csv += ";" + this.data.readings.map((r) => r.reading).join(",");
        csv += ";" + this.data.level;
        return csv;
    }

    static getAllVocabulary(): Promise<Collection<Vocabulary>> {
        return new Promise<Collection<Vocabulary>>((resolve, reject) => {
            const apiEndpointPath = 'https://api.wanikani.com/v2/subjects?types=vocabulary';
            requestUrl(apiEndpointPath)
                .then((axiosResponse: AxiosResponse<unknown>) => {
                    let collection = plainToClassFromExist(new Collection<Vocabulary>(Vocabulary), axiosResponse.data);
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

    static getVocabularies(ids: number[]): Promise<Collection<Vocabulary>> {
        return new Promise<Collection<Vocabulary>>((resolve, reject) => {
            const apiEndpointPath = `https://api.wanikani.com/v2/subjects?ids=${ids.join()}&types=vocabulary`;
            requestUrl(apiEndpointPath)
                .then((axiosResponse: AxiosResponse<unknown>) => {
                    let collection = plainToClassFromExist(new Collection<Vocabulary>(Vocabulary), axiosResponse.data);
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

export interface VocabularyContent extends SubjectContent {
    component_subject_ids: number[],
    context_sentences: ContextSentence[],
    meaning_mnemonic: string,
    parts_of_speech: string[],
    pronunciation_audios: PronunciationAudio[],
    readings: VocabularyReading[],
    reading_mnemonic: string
}

export interface VocabularyReading {
    accepted_answer: boolean,
    primary: boolean,
    reading: string
}

export interface ContextSentence {
    en: string,
    jp: string
}

export interface PronunciationAudio {
    url: string,
    content_type: string,
    metadata: PronunciationAudioMetadata
}

export interface PronunciationAudioMetadata {
    gender: string,
    source_id: number,
    pronunciation: string,
    voice_actor_id: number,
    voice_actor_name: string,
    voice_description: string
}