import { Expose } from "class-transformer";
import { Response } from "./response";

export abstract class Resource<D> extends Response<D> {
    @Expose()
    id: number;
}