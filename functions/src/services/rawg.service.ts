import { AxiosInstance } from 'axios';

import { Game, RawgResponse } from "../types/game.schema";
import { RawgResponseSchema } from "../types/game.schema";
// import { logger } from "firebase-functions";

export class RawgService {
    private client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this.client = client;
    }
    
    async getTopRatedGamesOfYear(pageSize = 10): Promise<Game[]> {
        const res = await this.client.get<RawgResponse>('/games', {
            params: {
                dates: getYearToDateRange(), // RAWG’s API expects date strings in the format: YYYY-MM-DD (ISO 8601)
                ordering: '-rating',
                page_size: pageSize,
            },
        });
        
        // logger.debug(res.request.path);
        // logger.debug(res.data);
        
        const parsed = RawgResponseSchema.parse(res.data);
        return parsed.results;
    }

    async getGamesByGenre(genreSlugs: string, pageSize = 10) {
        const res = await this.client.get<RawgResponse>('/games', {
            params: { 
                genres: genreSlugs, 
                ordering: '-rating', 
                page_size: pageSize 
            },
        });
        
        // logger.debug(res.request.path);
        // logger.debug(res.data);
        
        const parsed = RawgResponseSchema.parse(res.data);
        return parsed.results;
    }
}

function getYearToDateRange(): string {
    const now = new Date();
    const year = now.getFullYear();
    const endMonth = String(now.getMonth() + 1).padStart(2, '0');
    const endDay = String(now.getDate()).padStart(2, '0');
    return `${year}-01-01,${year}-${endMonth}-${endDay}`;
}
