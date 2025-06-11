import { z } from 'zod';

export const GameGenreSchema = z.object({
	id: z.number(),
	name: z.string(),
});

export const GameSchema = z.object({
	id: z.number(),
	name: z.string(),
	background_image: z.string().nullable(),
});

export const GameDetailSchema = GameSchema.extend({
	description: z.string().nullable(),
	genres: z.array(GameGenreSchema),
	rating: z.number(),
	released: z.string().nullable(),
});

export type Game = z.infer<typeof GameSchema>;
export type GameDetail = z.infer<typeof GameDetailSchema>;
export type GameGenre = z.infer<typeof GameGenreSchema>;