import axios, { AxiosResponse } from 'axios';
import { Config } from './config';



export function requestUrl(url: string): Promise<AxiosResponse<unknown>> {
    const apiToken = Config.getConfig().token_api;
    const requestHeaders = {
        Authorization: 'Bearer ' + apiToken
    };
    return axios.get(url, { headers: requestHeaders });
}