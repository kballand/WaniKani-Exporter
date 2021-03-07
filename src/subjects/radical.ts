import { AxiosResponse } from "axios";
import { plainToClassFromExist } from "class-transformer";
import { requestUrl } from "../helpers/helper";
import { Collection } from "../responses/collection";
import { Subject, SubjectContent } from "./subject";

export class Radical extends Subject<RadicalContent> {
    object: "radical";

    toCSV() {
        let csv: string = "";
        if (this.data.characters) {
            csv += this.data.characters;
            csv += ";" + this.data.meanings.map((m) => m.meaning).join(",");
            csv += ";" + this.data.level;
        }
        return csv;
    }

    static getAllRadicals(): Promise<Collection<Radical>> {
        return new Promise<Collection<Radical>>((resolve, reject) => {
            const apiEndpointPath = 'https://api.wanikani.com/v2/subjects?types=radical';
            requestUrl(apiEndpointPath)
                .then((axiosResponse: AxiosResponse<unknown>) => {
                    let collection = plainToClassFromExist(new Collection<Radical>(Radical), axiosResponse.data, { excludeExtraneousValues: true });
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

    static getRadicals(ids: number[]): Promise<Collection<Radical>> {
        return new Promise<Collection<Radical>>((resolve, reject) => {
            const apiEndpointPath = `https://api.wanikani.com/v2/subjects?ids=${ids.join()}&types=radical`;
            requestUrl(apiEndpointPath)
                .then((axiosResponse: AxiosResponse<unknown>) => {
                    let collection = plainToClassFromExist(new Collection<Radical>(Radical), axiosResponse.data, { excludeExtraneousValues: true });
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

export interface RadicalContent extends SubjectContent {
    amalgamation_subject_ids: number[],
    character_images: CharacterImage[]
}

export interface CharacterImage {
    url: string,
    content_type: CharacterImageContentType,
    metadata: CharacterImagePNGMetadata | CharacterImageXMLMetadata
}

export type CharacterImageContentType = 'image/svg+xml' | 'image/png';

export interface CharacterImageXML extends CharacterImage {
    content_type: 'image/svg+xml',
    metadata: CharacterImageXMLMetadata
}

export interface CharacterImageXMLMetadata {
    inline_styles: boolean
}

export interface CharacterImagePNG extends CharacterImage {
    content_type: 'image/png',
    metadata: CharacterImagePNGMetadata
}

export interface CharacterImagePNGMetadata {
    color: string,
    dimension: string,
    style_name: string
}