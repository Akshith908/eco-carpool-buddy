import express from 'express';
import { supabase } from '../db';

const router = express.Router();

// GET all rides
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
        .from('rides')
        .select('*')
        .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (err: any) {
        console.error("Supabase error details:", err);
        console.error('❌ Error fetching rides:', err.message);
        res.status(500).json({ error: 'Failed to fetch rides' });
    }
});

// POST new ride
router.post('/', async (req, res) => {
    try {
        const {
            driver_name,
            phone_number,
            seats_available,
            travel_time,
            origin_lat,
            origin_lng,
            destination_lat,
            destination_lng,
        } = req.body;

        if (
            !driver_name ||
            !phone_number ||
            !seats_available ||
            !travel_time ||
            !origin_lat ||
            !origin_lng ||
            !destination_lat ||
            !destination_lng
        ) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const { data, error } = await supabase
        .from('rides')
        .insert([
            {
                driver_name,
                phone_number,
                seats_available,
                travel_time,
                origin_lat,
                origin_lng,
                destination_lat,
                destination_lng,
            },
        ])
        .select();

        if (error) throw error;

        res.status(201).json({ message: 'Ride added successfully', ride: data[0] });
    } catch (err: any) {
        console.error('❌ Error adding ride:', err.message);
        res.status(500).json({ error: 'Failed to add ride' });
    }
});
// --- update driver’s live GPS position ---
router.put('/:id/location', async (req, res) => {
    try {
        const { id } = req.params;
        const { current_lat, current_lng } = req.body;

        if (!current_lat || !current_lng)
            return res.status(400).json({ error: 'Missing coordinates' });

        const { data, error } = await supabase
        .from('rides')
        .update({ current_lat, current_lng })
        .eq('id', id)
        .select();

        if (error) throw error;

        res.status(200).json({ message: 'Location updated', ride: data[0] });
    } catch (err: any) {
        console.error('❌ Error updating location:', err.message);
        res.status(500).json({ error: 'Failed to update location' });
    }
});


export default router;
