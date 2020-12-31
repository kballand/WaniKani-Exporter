import { Response } from "./response";

export abstract class Resource<D> extends Response<D> {
    id: number;
}