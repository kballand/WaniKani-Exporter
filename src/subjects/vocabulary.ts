import { Subject, SubjectContent } from "./subject";

export class Vocabulary extends Subject<VocabularyContent> {
    object: 'vocabulary';

    toCSV() {
        let csv: string = this.data.characters;
        csv += ";" + this.data.meanings.map((m) => m.meaning).join(",");
        csv += ";" + this.data.readings.map((r) => r.reading).join(",");
        csv += ";" + this.data.level;
        return csv;
    }
}

export interface VocabularyContent extends SubjectContent {
    component_subject_ids: number[],
    context_sentences: ContextSentence[],
    meaning_mnemonic: string,
    parts_of_speech: string[],
    pronunciation_audios: PronunciationAudio[],
    readings: VocabularyReading[],
    reading_mnemonic: string
}

export interface VocabularyReading {
    accepted_answer: boolean,
    primary: boolean,
    reading: string
}

export interface ContextSentence {
    en: string,
    jp: string
}

export interface PronunciationAudio {
    url: string,
    content_type: string,
    metadata: PronunciationAudioMetadata
}

export interface PronunciationAudioMetadata {
    gender: string,
    source_id: number,
    pronunciation: string,
    voice_actor_id: number,
    voice_actor_name: string,
    voice_description: string
}