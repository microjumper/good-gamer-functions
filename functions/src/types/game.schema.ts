import { z } from 'zod';

export const GameSchema = z.object({
	id: z.number(),
	name: z.string(),
	background_image: z.string().nullable(),
	rating: z.number(),
	released: z.string().nullable(),
});

export const RawgResponseSchema = z.object({
	results: z.array(GameSchema),
});


export type Game = z.infer<typeof GameSchema>;
export type RawgResponse = z.infer<typeof RawgResponseSchema>;