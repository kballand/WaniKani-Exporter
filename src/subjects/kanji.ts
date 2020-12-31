import { Subject, SubjectContent } from "./subject";

export class Kanji extends Subject<KanjiContent> {
    object: "kanji";

    toCSV() {
        let csv: string = this.data.characters;
        csv += ";" + this.data.meanings.map((m) => m.meaning).join(",");
        let onyomi: string[] = [];
        let kunyomi: string[] = [];
        this.data.readings.forEach((reading) => {
            if(reading.type === 'onyomi') {
                onyomi.push(reading.reading);
             } else if(reading.type == 'kunyomi') {
                kunyomi.push(reading.reading);
            }
        });
        csv += ";" + onyomi.join(",");
        csv += ";" + kunyomi.join(",");
        csv += ";" + this.data.level;
        return csv;
    }
}

export interface KanjiContent extends SubjectContent {
    amalgamation_subject_ids: number[],
    component_subject_ids: number[],
    reading_mnemonic?: string,
    meaning_hint?: string,
    reading_hint?: string,
    readings: KanjiReading[],
    visually_similar_subjects_ids: number[]
}

export interface KanjiReading {
    reading: string,
    primary: boolean,
    accepted_answer: boolean,
    type: KanjiReadingType
}

export type KanjiReadingType = 'kunyomi' | 'onyomi';