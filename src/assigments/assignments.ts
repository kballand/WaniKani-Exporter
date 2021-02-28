import { Resource } from "../responses/resource";
import { Collection } from "../responses/collection";
import { requestUrl } from "../helpers/helper";
import { plainToClassFromExist } from "class-transformer";
import { AxiosResponse } from "axios";

export class Assignment extends Resource<AssignmentSubject> {

    static getAssignments(): Promise<Collection<Assignment>> {
        return new Promise<Collection<Assignment>>((resolve, reject) => {
            const apiEndpointPath = 'https://api.wanikani.com/v2/assignments';
            requestUrl(apiEndpointPath)
                .then((axiosResponse: AxiosResponse<unknown>) => {
                    let collection = plainToClassFromExist(new Collection<Assignment>(Assignment), axiosResponse.data);
                    collection.combinePages()
                        .then(collectionsCombined => {
                            collectionsCombined.sort((a, b) => {
                                return a.id - b.id;
                            });
                            resolve(collectionsCombined);
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    static getKanjiAssignments(): Promise<Collection<Assignment>> {
        return new Promise<Collection<Assignment>>((resolve, reject) => {
            const apiEndpointPath = 'https://api.wanikani.com/v2/assignments?subject_types=kanji';
            requestUrl(apiEndpointPath)
                .then((axiosResponse: AxiosResponse<unknown>) => {
                    let collection = plainToClassFromExist(new Collection<Assignment>(Assignment), axiosResponse.data);
                    collection.combinePages()
                        .then(collectionsCombined => {
                            collectionsCombined.sort((a, b) => {
                                return a.id - b.id;
                            });
                            resolve(collectionsCombined);
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    static getRadicalAssignments(): Promise<Collection<Assignment>> {
        return new Promise<Collection<Assignment>>((resolve, reject) => {
            const apiEndpointPath = 'https://api.wanikani.com/v2/assignments?subject_types=radical';
            requestUrl(apiEndpointPath)
                .then((axiosResponse: AxiosResponse<unknown>) => {
                    let collection = plainToClassFromExist(new Collection<Assignment>(Assignment), axiosResponse.data);
                    collection.combinePages()
                        .then(collectionsCombined => {
                            collectionsCombined.sort((a, b) => {
                                return a.id - b.id;
                            });
                            resolve(collectionsCombined);
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    static getVocabularyAssignments(): Promise<Collection<Assignment>> {
        return new Promise<Collection<Assignment>>((resolve, reject) => {
            const apiEndpointPath = 'https://api.wanikani.com/v2/assignments?subject_types=vocabulary';
            requestUrl(apiEndpointPath)
                .then((axiosResponse: AxiosResponse<unknown>) => {
                    let collection = plainToClassFromExist(new Collection<Assignment>(Assignment), axiosResponse.data);
                    collection.combinePages()
                        .then(collectionsCombined => {
                            collectionsCombined.sort((a, b) => {
                                return a.id - b.id;
                            });
                            resolve(collectionsCombined);
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    toCSV(): string {
        return "";
    }
}

export interface AssignmentSubject {
    available_at?: Date,
    burned_at?: Date,
    created_at: Date,
    hidden: boolean,
    passed_at?: Date,
    resurrected_at?: Date,
    srs_stage: number,
    started_at?: Date,
    subject_id: number,
    subject_type: "radical" | "kanji" | "vocabulary",
    unlocked_at?: Date
}