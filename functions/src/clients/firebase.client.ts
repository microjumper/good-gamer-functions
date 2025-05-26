import * as admin from "firebase-admin";

import * as dotenv from 'dotenv';
dotenv.config();

import { Game } from "../types/game.schema";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
    databaseURL: process.env.REALTIME_DATABASE_URL,
});

const database = admin.database();

/**
 * Save data to Firebase Realtime Database at the provided path.
 * @param path - Path in the DB where the data should be saved.
 * @param data - Data to save.
 * @returns Promise<void>
 */
export async function saveToRealtimeDatabase(path: string, data: Game[]): Promise<void> {
  await database.ref(path).set(data);
}