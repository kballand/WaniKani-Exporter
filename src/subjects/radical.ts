import { Subject, SubjectContent } from "./subject";
import  { createWriteStream, promises as fs } from "fs";
import axios, { AxiosResponse } from 'axios';
import { Stream } from "stream";
import * as path from "path";

export class Radical extends Subject<RadicalContent> {
    object: "radical";

    toCSV() {
        let csv: string = "";
        if(this.data.characters) {
            csv += this.data.characters;
            csv += ";" + this.data.meanings.map((m) => m.meaning).join(",");
            csv += ";" + this.data.level;
        }
        return csv;
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