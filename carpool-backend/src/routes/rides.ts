import { Router } from 'express';
import { query } from '../db';
import { Ride } from '../models/ride';

export const ridesRouter = Router();

// GET /api/rides
ridesRouter.get('/', async (req, res) => {
    try {
        const result = await query('SELECT * FROM rides ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching rides' });
    }
});

// POST /api/rides
ridesRouter.post('/', async (req, res) => {
    const { driverName, phoneNumber, seatsAvailable, travelTime, latitude, longitude } = req.body;

    if (!driverName || !phoneNumber || !seatsAvailable || !travelTime || !latitude || !longitude) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await query(
            `INSERT INTO rides (driver_name, phone_number, seats_available, travel_time, latitude, longitude)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                                   [driverName, phoneNumber, seatsAvailable, travelTime, latitude, longitude]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error adding ride' });
    }
});
