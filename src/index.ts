import 'reflect-metadata';
import 'es6-shim';
import { Radical } from './subjects/radical';
import { Kanji } from './subjects/kanji';
import { Vocabulary } from './subjects/vocabulary';
import { Assignment } from './assigments/assignments';

Assignment.getKanjiAssignments()
    .then(kanjiAssignments => kanjiAssignments.data.map(kanjiAssignment => kanjiAssignment.data.subject_id))
    .then(Kanji.getKanjis)
    .then(kanji => kanji.exportCSV("data/kanji.csv"))
    .catch(error => { console.log(error) });

Assignment.getRadicalAssignments()
    .then(radicalAssignments => radicalAssignments.data.map(radicalAssignment => radicalAssignment.data.subject_id))
    .then(Radical.getRadicals)
    .then(radicals => radicals.exportCSV("data/radical.csv"))
    .catch(error => { console.log(error) });

Assignment.getVocabularyAssignments()
    .then(vocabularyAssignments => vocabularyAssignments.data.map(vocabularyAssignment => vocabularyAssignment.data.subject_id))
    .then(Vocabulary.getVocabularies)
    .then(vocabulary => vocabulary.exportCSV("data/vocabulary.csv"))
    .catch(error => { console.log(error) });