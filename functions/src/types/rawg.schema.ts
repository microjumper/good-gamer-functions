import { z } from "zod";

import { GameSchema } from "./game.schema";

export const RawgResponseSchema = z.object({
	results: z.array(GameSchema),
});

export type RawgResponse = z.infer<typeof RawgResponseSchema>;