import 'reflect-metadata';
import 'es6-shim';
import { AxiosResponse } from 'axios';
import { plainToClassFromExist } from 'class-transformer';
import { Collection } from './responses/collection';
import { Radical } from './subjects/radical';
import { Kanji } from './subjects/kanji';
import { Vocabulary } from './subjects/vocabulary';
import { requestUrl } from './helpers/helper';

const apiEndpointPath = 'https://api.wanikani.com/v2/subjects?levels=1,2,3,4,5,6,7,8,9,10&types=kanji';

requestUrl(apiEndpointPath)
    .then((axiosResponse: AxiosResponse<unknown>) => {
        let collection = plainToClassFromExist(new Collection<Kanji>(Kanji), axiosResponse.data);
        collection.combinePages()
            .then((collectionsCombined) => {
                return collectionsCombined.exportCSV("kanji.csv");
            });
    })
    .catch(error => {
        console.log(error)
    });

