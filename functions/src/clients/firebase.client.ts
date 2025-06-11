import * as admin from "firebase-admin";

import * as dotenv from 'dotenv';

dotenv.config();

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
export async function saveToRealtimeDatabase<T>(path: string, data: T): Promise<void> {
  await database.ref(path).set(data);
}

/**
 * Reads data from Firebase Realtime Database at the provided path.
 * @template T The expected type of the data.
 * @param {string} path - The path in the database to read data from.
 * @returns {Promise<T | null>} A promise that resolves with the data if found, otherwise null.
 */
export async function readFromRealtimeDatabase<T>(path: string): Promise<T | null> {
  const snapshot = await admin.database().ref(path).once('value');
  return snapshot.exists() ? snapshot.val() as T : null;
}
