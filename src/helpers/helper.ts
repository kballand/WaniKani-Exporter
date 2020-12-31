import axios, { AxiosResponse } from 'axios';
import { writeFile } from 'fs';
import { EOL } from 'os';
import { Response } from '../responses/response';

const apiToken = 'ea575f3e-c01a-4f20-b37c-414ec5b7d98f';
const requestHeaders = {
    Authorization: 'Bearer ' + apiToken
};

export function requestUrl(url: string): Promise<AxiosResponse<unknown>> {
    return axios.get(url, { headers: requestHeaders });
}