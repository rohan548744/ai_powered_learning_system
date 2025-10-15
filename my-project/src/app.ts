import express from 'express';
import { Request, Response } from 'express';
import { MyType } from './types/index';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the AI Learning System!');
});

// Example route using a type
app.post('/data', (req: Request, res: Response) => {
    const data: MyType = req.body;
    // Process the data
    res.status(201).send(data);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});