import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './db';
import ridesRouter from './routes/rides';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Health check
app.get('/', (req, res) => res.send('Carpool Backend Running 🚗'));

// ✅ Mount under both routes so frontend & backend always sync
app.use(['/rides', '/api/rides'], ridesRouter);

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    testConnection();
});
