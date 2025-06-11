import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { logger } from 'firebase-functions';

import { Request } from 'express';

import { createRawgClient } from "../clients/rawg.client";
import { RawgService } from "../services/rawg.service";
import { Game, GameDetail } from "../types/game.schema";

const RAWG_API_KEY = defineSecret('RAWG_API_KEY');

type AllowedRawgTypes = Game | Game[] | GameDetail;
type HandlerCallback<T extends AllowedRawgTypes> = (service: RawgService, req: Request) => Promise<T>;

export function createRawgHandler<T extends AllowedRawgTypes>(callback: HandlerCallback<T>) {
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
