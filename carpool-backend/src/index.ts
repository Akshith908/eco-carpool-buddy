import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection } from "./db.js";
import ridesRouter from "./routes/rides.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (_req, res) => res.send("Carpool Backend Running"));

// API routes
app.use("/api/rides", ridesRouter);

// Start server
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, "0.0.0.0", async () => {
    console.log(`🚗 Server running on port ${PORT}`);
    await testConnection();
});
