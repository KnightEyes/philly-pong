import express from 'express';
import * as dataService from './dataService.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Point robustly to the philly-pong-ui/dist folder relative to the project root
const frontendPath = path.join(__dirname, '../philly-pong-ui/dist');
app.use(express.static(frontendPath));

// API Routes
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/api/tables', async (req, res) => {
    try {
        const tables = await dataService.getTables();
        res.json(tables);
    } catch (error) {
        console.error('Error fetching tables:', error);
        res.status(500).json({ error: 'Failed to retrieve tables' });
    }
});

// Single-page fallback
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Only ONE listen call using Render's environment port
const PORT = process.env.PORT || 3000;
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});