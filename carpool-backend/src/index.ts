import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ridesRouter } from './routes/rides';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/rides', ridesRouter);

app.get('/', (req, res) => res.send('Carpool Backend Running'));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
