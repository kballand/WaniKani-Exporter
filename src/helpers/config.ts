import { Expose, plainToClassFromExist } from "class-transformer";
import { readFileSync } from "fs";

export class Config {
    private static instance: Config;

    @Expose()
    token_api: string;

    private constructor() {

    }

    public static loadFromFile(fileName: string): Config {
        const configData = JSON.parse(readFileSync(fileName, { encoding: "utf8" }));
        Config.instance = plainToClassFromExist(new Config(), configData, { excludeExtraneousValues: true });
        return Config.instance;
    }

    public static getConfig(): Config {
        if (!Config.instance) {
            throw "Configuration non chargée";
        }
        return Config.instance;
    }
}