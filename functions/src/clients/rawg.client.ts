import axios, { AxiosInstance } from 'axios';

const RAWG_BASE_URL = 'https://api.rawg.io/api';

export function createRawgClient(apiKey: string): AxiosInstance {
    return axios.create({
        baseURL: RAWG_BASE_URL,
        params: {
            key: apiKey,
        },
    });
}
