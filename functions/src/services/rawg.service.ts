import { AxiosInstance } from 'axios';

import { Game, GameDetail, GameDetailSchema } from "../types/game.schema";
import { RawgResponse, RawgResponseSchema } from "../types/rawg.schema";

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
        
        const parsed = RawgResponseSchema.parse(res.data);
        return parsed.results;
    }

    async getGameById(gameId: number): Promise<GameDetail> {
        const res = await this.client.get<GameDetail>(`/games/${gameId}`);
        return GameDetailSchema.parse(res.data);
    }
}

function getYearToDateRange(): string {
    const now = new Date();
    const year = now.getFullYear();
    const endMonth = String(now.getMonth() + 1).padStart(2, '0');
    const endDay = String(now.getDate()).padStart(2, '0');
    return `${year}-01-01,${year}-${endMonth}-${endDay}`;
}
