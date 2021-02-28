import { Response } from "./response";
import { Resource } from "./resource";
import { EOL } from "os";
import { Subject, SubjectContent } from "../subjects/subject";
import { requestUrl } from "../helpers/helper";
import { AxiosResponse } from "axios";
import { plainToClassFromExist } from "class-transformer";

export class Collection<R extends Resource<unknown>> extends Response<R[]> {
    object: "collection";
    pages: Pagination;
    total_count: number;

    toCSV() {
        this.sort();
        let finalCsv = "";
        let first = true;
        for(let resource of this.data) {
            let resourceCsv = resource.toCSV();
            if(resourceCsv && resourceCsv !== '') {
                if(first) {
                    first = false;
                } else {
                    finalCsv += EOL;
                }
                finalCsv += resourceCsv;
            }
        }
        return finalCsv;
    }

    sort() {
        this.data = this.data.sort((a, b) => {
            if(a instanceof Subject && b instanceof Subject) {
                if((a as Subject<SubjectContent>).data.level != (b as Subject<SubjectContent>).data.level) {
                    return (a as Subject<SubjectContent>).data.level - (b as Subject<SubjectContent>).data.level;
                }
            }
            return a.id - b.id;
        });
    }

    hasNextPage(): boolean {
        return !!this.pages.next_url;
    }

    getNextPage(): Promise<Collection<R>> {
        return new Promise<Collection<R>>((resolve, reject) => {
            if(!this.hasNextPage()) {
                reject();
            }
            requestUrl(this.pages.next_url as string)
            .then((axiosResponse: AxiosResponse<unknown>) => {
                const collection = plainToClassFromExist(new Collection<R>(this.type), axiosResponse.data);
                resolve(collection);
            })
            .catch(error => {
                reject(error);
            })
        });
    }

    hasPreviousPage(): boolean {
        return !!this.pages.previous_url;
    }

    getPreviousPage() {
        return new Promise<Collection<R>>((resolve, reject) => {
            if(!this.hasPreviousPage()) {
                reject();
            }
            requestUrl(this.pages.previous_url as string)
            .then((axiosResponse: AxiosResponse<unknown>) => {
                const collection = plainToClassFromExist(new Collection<R>(this.type), axiosResponse.data);
                resolve(collection);
            })
            .catch(error => {
                reject(error);
            })
        });
    }

    getPreviousPages() {
        return new Promise<Collection<R>[]>((resolve, reject) => {
            let collections : Collection<R>[] = [];
            if(this.hasPreviousPage()) {
                this.getPreviousPage()
                .then((previousPage) => {
                    collections = [previousPage, ...collections];
                    previousPage.getPreviousPages()
                    .then((previousPages) => {
                        collections = [...previousPages, ...collections];
                        resolve(collections);
                    }).catch(reject);
                }).catch(reject);
            } else {
                resolve(collections);
            }
        });
    }

    getNextPages() {
        return new Promise<Collection<R>[]>((resolve, reject) => {
            let collections : Collection<R>[] = [];
            if(this.hasNextPage()) {
                this.getNextPage()
                .then((nextPage) => {
                    collections = [...collections, nextPage]
                    nextPage.getNextPages()
                    .then((nextPages) => {
                        collections = [...collections, ...nextPages]
                        resolve(collections);
                    }).catch(reject);
                }).catch(reject);
            } else {
                resolve(collections);
            }
        });
    }

    getAllPages() {
        return new Promise<Collection<R>[]>((resolve, reject) => {
            let collections : Collection<R>[];
            this.getPreviousPages()
            .then((previousPages) => {
                collections = previousPages;
            })
            .then(() => {
                collections = [...collections, this];
            })
            .then(() => this.getNextPages())
            .then((nextPages) => {
                collections = [...collections, ...nextPages];
                resolve(collections);
            })
            .catch(reject);
            
        });
    }

    combinePages() {
        return new Promise<Collection<R>>((resolve, reject) => {
            this.getAllPages()
            .then((pages) => {
                let combination : Collection<R> = Object.create(this);
                combination.data = [];
                combination.pages.next_url = undefined;
                combination.pages.previous_url = undefined;
                combination.url = undefined;
                combination.total_count = this.total_count;
                combination.pages.per_page = this.total_count;
                let maxUpdateDate = -1;
                for(let page of pages) {
                    let updateDate = new Date(page.data_updated_at).getTime();
                    if(updateDate > maxUpdateDate) {
                        maxUpdateDate = updateDate;
                    }
                    combination.data = combination.data.concat(page.data);
                }
                combination.data_updated_at = new Date(maxUpdateDate).toString();
                resolve(combination);
            })
            .catch(reject);
        });
    }
}

export interface Pagination {
    next_url?: string,
    previous_url?: string,
    per_page: number
}