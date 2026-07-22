import express from 'express';
import * as dataService from './dataService.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json()); // <--- THIS IS CRITICAL: It allows Express to read JSON bodies

app.get('/api/tables', async (req, res) => {
    try {
        const tables = await dataService.getTables();
        res.json(tables);
    } catch (error) {
        console.error('Error fetching tables:', error);
        res.status(500).json({ error: 'Failed to retrieve tables' });
    }
});

// The new POST route
app.post('/api/tables', async (req, res) => {
    try {
        const newTable = req.body;
        const addedTable = await dataService.addTable(newTable);
        return res.status(201).json(addedTable);
    } catch (error) {
        console.error('Error adding table:', error);
        return res.status(500).json({ error: 'Failed to add table' });
    }
});

app.delete('/api/tables/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log("Attempting to delete ID:", id);
        const success = await dataService.deleteTable(id);

        if (success) {
            res.status(200).json({ message: "Table deleted successfully" });
        } else {
            res.status(404).json({ message: "Table not found" });
        }
    } catch (error) {
        console.error('Error deleting table:', error);
        res.status(500).json({ error: 'Failed to delete table' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
