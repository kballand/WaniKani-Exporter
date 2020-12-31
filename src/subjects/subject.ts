import { Resource } from "../responses/resource";

export abstract class Subject<D extends SubjectContent> extends Resource<D> {

}

export interface SubjectContent {
    auxiliary_meanings: AuxiliaryMeaning[],
    characters: string,
    created_at: Date,
    document_url: string,
    hidden_at?: Date,
    lesson_position: number,
    level: number,
    meaning_mnemonic: string,
    meanings: Meaning[],
    slug: string,
    spaced_repetition_system_id: number
}

export interface Meaning {
    meaning: string,
    primary: boolean,
    accepted_answer: boolean
}

export interface AuxiliaryMeaning {
    meaning: string,
    type: AuxiliaryMeaningType
}

export type AuxiliaryMeaningType = 'whitelist' | 'blacklist';
