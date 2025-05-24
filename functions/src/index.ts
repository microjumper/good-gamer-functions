import { Request } from 'express';

import { RawgService } from "./services/rawg.service";
import { createRawgHandler } from "./factories/handler-factory";
import { Game } from "./types/game.schema";

export const topRatedThisYear = createRawgHandler(async (service: RawgService): Promise<Game[]> => {
    return service.getTopRatedGamesOfYear();
});

export const gamesByGenre = createRawgHandler(async (service: RawgService, req: Request): Promise<Game[]> => {
	const genres = String(req.query.genres);

	if (!genres) {
		throw new Error('Genre slug is required');
	}

	return service.getGamesByGenre(genres);
});