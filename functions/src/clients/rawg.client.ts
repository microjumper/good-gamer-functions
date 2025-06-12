import axios, { AxiosInstance } from 'axios';

const RAWG_BASE_URL = 'https://api.rawg.io/api';

/**
 * Creates an Axios client instance configured to interact with the RAWG API.
 *
 * @param {string} apiKey - The API key used for authenticating requests to the RAWG API.
 * @return {AxiosInstance} The configured Axios instance for making API requests to the RAWG API.
 */
export function createRawgClient(apiKey: string): AxiosInstance {
    return axios.create({
        baseURL: RAWG_BASE_URL,
        params: {
            key: apiKey,
        },
    });
}
