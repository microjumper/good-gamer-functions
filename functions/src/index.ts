import { Request } from 'express';

import { RawgService } from "./services/rawg.service";
import { createRawgHandler } from "./factories/handler-factory";
import { Game, GameDetail } from "./types/game.schema";
import { readFromRealtimeDatabase, saveToRealtimeDatabase } from "./clients/firebase.client";

export const topRatedThisYear = createRawgHandler(async (service: RawgService): Promise<Game[]> => {
	const games: Game[] = await service.getTopRatedGamesOfYear();
	
	await saveToRealtimeDatabase("/topRatedThisYear", games);
	
    return games;
});

export const gameById = createRawgHandler(async (service: RawgService, req: Request): Promise<GameDetail> => {
	const gameId = Number(req.query.gameId);
	
	if (!gameId) {
		throw new Error('Game ID is required');
	}

	// Try to get the game from Firebase
	const cachedGame = await readFromRealtimeDatabase<GameDetail>(`/games/${gameId}`);
	if (cachedGame) {
		return cachedGame;
	}

	// If not found, get from RAWG and save to Firebase
	const gameDetail = await service.getGameById(gameId);
	await saveToRealtimeDatabase(`/games/${gameId}`, gameDetail);
	
	return gameDetail;
});