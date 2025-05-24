import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { logger } from 'firebase-functions';

import { Request } from 'express';

import { createRawgClient } from "../clients/rawg.client";
import { RawgService } from "../services/rawg.service";
import { Game } from "../types/game.schema";

const RAWG_API_KEY = defineSecret('RAWG_API_KEY');

type HandlerCallback = (service: RawgService, req: Request) => Promise<Game[]>;

export function createRawgHandler(callback: HandlerCallback) {
	return onRequest(
		{ secrets: [RAWG_API_KEY] },
		async (req, res) => {
			try {
				const KEY = RAWG_API_KEY.value();
				const client = createRawgClient(KEY);
				const service = new RawgService(client);
				const data = await callback(service, req);
				
				res.status(200).json(data);
			} catch (err) {
				logger.error('RAWG API error:', err);
				
				res.status(500).json({error: 'Internal server error'});
			}
		}
	);
}
