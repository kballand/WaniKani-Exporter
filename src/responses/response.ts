import { Exclude, Type } from "class-transformer";
import  { writeFile } from "fs";

export abstract class Response<D> {
    @Exclude()
    protected type: Function;

    object: ObjectType;
    url?: string;
    data_updated_at: string;

    @Type(options => { return (options?.newObject as Response<D>).type; })
    data: D;

    constructor(type: Function) {
        this.type = type;
    }

    abstract toCSV(): string;

    exportCSV(fileName: string) {
        const csv = this.toCSV();
        writeFile(fileName, csv, (error) => {
            if(error) {
                console.error(`Failed to create or open file : ${fileName} !`);
            }
        });
    }
}

export type ObjectType = 'collection' | 'report' | 'assignment' | 'kanji' |
                        'level_progression' | 'radical' | 'reset' |
                        'review_statistic' | 'review' |
                        'spaced_repetition_system' | 'study_material' |
                        'user' | 'vocabulary';