import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

// This gets the directory where dataService.ts is actually sitting
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Now explicitly point to the file in the 'src' folder
const filePath = path.join(__dirname, 'tables.json');

// Venue data is read-only at runtime. The venue list lives in
// src/tables.json and changes only via git commits + redeploy.
// There are intentionally no write functions here: the previous
// addTable/deleteTable helpers let unauthenticated API callers mutate
// the live file on Render's ephemeral disk, so the live list drifted
// away from the committed list and then snapped back on restart.

// 1. Get all tables (Sanitized)
export async function getTables() {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const tables = JSON.parse(data);

        // Always filter out any weird nulls just in case
        return Array.isArray(tables) ? tables.filter(t => t !== null) : [];
    } catch (error) {
        console.error('Error reading tables.json:', error);
        return [];
    }
}