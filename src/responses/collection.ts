import { AxiosResponse } from "axios";
import { Expose, plainToClassFromExist } from "class-transformer";
import { EOL } from "os";
import { requestUrl } from "../helpers/helper";
import { Resource } from "./resource";
import { Response } from "./response";

export class Collection<R extends Resource<unknown>> extends Response<R[]> {
    object: "collection";
    @Expose()
    pages?: Pagination;
    @Expose()
    total_count?: number;

    toCSV() {
        let finalCsv = "";
        let first = true;
        for (let resource of this.data) {
            let resourceCsv = resource.toCSV();
            if (resourceCsv && resourceCsv !== '') {
                if (first) {
                    first = false;
                } else {
                    finalCsv += EOL;
                }
                finalCsv += resourceCsv;
            }
        }
        return finalCsv;
    }

    sort(sortingFunction: (a: R, b: R) => number) {
        this.data = this.data.sort(sortingFunction);
    }

    hasNextPage(): boolean {
        return this.pages ? !!this.pages.next_url : false;
    }

    getNextPage(): Promise<Collection<R>> {
        return new Promise<Collection<R>>((resolve, reject) => {
            if (!this.hasNextPage()) {
                reject();
            } else {
                requestUrl(decodeURIComponent((this.pages as Pagination).next_url as string))
                    .then((axiosResponse: AxiosResponse<unknown>) => {
                        const collection = plainToClassFromExist(new Collection<R>(this.type), axiosResponse.data, { excludeExtraneousValues: true });
                        resolve(collection);
                    })
                    .catch(error => {
                        reject(error);
                    })
            }
        });
    }

    hasPreviousPage(): boolean {
        return this.pages ? !!this.pages.previous_url : false;
    }

    getPreviousPage() {
        return new Promise<Collection<R>>((resolve, reject) => {
            if (!this.hasPreviousPage()) {
                reject();
            } else {
                requestUrl(decodeURIComponent((this.pages as Pagination).previous_url as string))
                    .then((axiosResponse: AxiosResponse<unknown>) => {
                        const collection = plainToClassFromExist(new Collection<R>(this.type), axiosResponse.data, { excludeExtraneousValues: true });
                        resolve(collection);
                    })
                    .catch(error => {
                        reject(error);
                    })
            }
        });
    }

    getPreviousPages() {
        return new Promise<Collection<R>[]>((resolve, reject) => {
            let collections: Collection<R>[] = [];
            if (this.hasPreviousPage()) {
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
            let collections: Collection<R>[] = [];
            if (this.hasNextPage()) {
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
            let collections: Collection<R>[];
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
                    resolve(Collection.combineSpecificPages(pages));
                })
                .catch(reject);
        });
    }

    static combineSpecificPages<R extends Resource<unknown>>(pages: Collection<R>[]) {
        let combination: Collection<R> = Object.create(pages[0]);
        combination.data = [];
        combination.pages = undefined;
        combination.url = undefined;
        combination.data_updated_at = undefined;
        combination.total_count = 0;
        let maxUpdateDate = -1;
        for (let page of pages) {
            combination.data = combination.data.concat(page.data);
            combination.total_count += page.total_count ?? 0;
        }
        combination.data_updated_at = new Date(maxUpdateDate).toString();
        return combination;
    }
}

export interface Pagination {
    next_url?: string,
    previous_url?: string,
    per_page: number
}