import { Request } from 'express';

import { RawgService } from "./services/rawg.service";
import { createRawgHandler } from "./factories/handler-factory";
import { Game, GameDetail } from "./types/game.schema";
import { readFromRealtimeDatabase, saveToRealtimeDatabase } from "./clients/firebase.client";

/**
 * A handler function that retrieves and processes the top-rated games of the year.
 *
 * This variable uses the `createRawgHandler` utility to define an asynchronous
 * function that interacts with a RAWG service to fetch the top-rated games of the
 * current year. It also saves the retrieved data into a real-time database
 * for further usage.
 *
 * @type {Function}
 * @param {RawgService} service - An instance of the RAWG service providing the method
 * to fetch the top-rated games of the year.
 * @returns {Promise<Game[]>} A promise that resolves with an array of Game objects
 * representing the top-rated games of the year.
 */
export const topRatedThisYear = createRawgHandler(async (service: RawgService): Promise<Game[]> => {
	const games: Game[] = await service.getTopRatedGamesOfYear();
	
	await saveToRealtimeDatabase("/topRatedThisYear", games);
	
    return games;
});

/**
 * Handles the retrieval of game details by ID.
 *
 * `gameById` is an asynchronous function that fetches game details using a given game ID. It first
 * attempts to retrieve the game information from a Firebase real-time database. If the game details
 * are not found in the cache, it fetches the information from the RAWG API through the provided service,
 * saves the fetched data to the Firebase database for future use, and then returns the game details.
 *
 * Throws an error if a game ID is not provided or if the retrieval process encounters an issue.
 *
 * @constant
 * @type {function}
 * @param {RawgService} service - The RAWG service instance used for fetching game data.
 * @param {Request} req - The HTTP request object containing the game ID in the query parameters.
 * @returns {Promise<GameDetail>} A promise that resolves to the game's detailed information.
 */
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