import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

// This gets the directory where dataService.ts is actually sitting
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Now explicitly point to the file in the 'src' folder
const filePath = path.join(__dirname, 'tables.json');

// 1. Initialize or Ensure the file exists
async function ensureFileExists() {
    try {
        await fs.access(filePath);
    } catch {
        // If file doesn't exist, create it with an empty array
        await fs.writeFile(filePath, JSON.stringify([]));
    }
}

// 2. Get all tables (Sanitized)
export async function getTables() {
    await ensureFileExists();
    const data = await fs.readFile(filePath, 'utf-8');
    const tables = JSON.parse(data);
    
    // Always filter out any weird nulls just in case
    return Array.isArray(tables) ? tables.filter(t => t !== null) : [];
}

// 3. Save tables (The only way data gets written)
async function saveTables(tables: any[]) {
    // Forcefully remove nulls before saving to disk
    const cleanTables = tables.filter(t => t !== null && t !== undefined);
    await fs.writeFile(filePath, JSON.stringify(cleanTables, null, 2));
}

// 4. Example: Add table
export async function addTable(newTable: any) {
    // 1. If the ID is missing or empty, generate one automatically
    if (!newTable.id || newTable.id.trim() === "") {
        // Creates a unique ID based on the current time
        newTable.id = 't' + Date.now(); 
    }
    
    // 2. Validate that we have at least a name or other core data
    // (Optional: remove this if you want to allow empty tables)
    if (!newTable.name) {
        newTable.name = "Unnamed Table";
    }
    
    const tables = await getTables();
    tables.push(newTable);
    await saveTables(tables);
}

// 5. Example: Delete table
export async function deleteTable(id: string) {
    let tables = await getTables();
    const initialLength = tables.length;
    
    tables = tables.filter(t => t.id !== id);
    
    if (tables.length !== initialLength) {
        await saveTables(tables);
        return true;
    }
    return false;
}