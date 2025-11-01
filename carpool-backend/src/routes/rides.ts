import express from "express";
import { supabase } from "../db.js"; // ✅ ensure .js if compiled to JS
const router = express.Router();

/**
 * GET /api/rides
 * Fetch all available rides (most recent first)
 */
router.get("/", async (_req, res) => {
    try {
        const { data, error } = await supabase
        .from("rides")
        .select("*")
        .order("created_at", { ascending: false });

        if (error) throw error;

        return res.status(200).json(data || []);
    } catch (err: any) {
        console.error("❌ Error fetching rides:", err.message);
        return res.status(500).json({ error: "Server error fetching rides" });
    }
});

/**
 * POST /api/rides
 * Create a new ride entry
 */
router.post("/", async (req, res) => {
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

        // ✅ Validate input
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
            return res.status(400).json({ error: "Missing required fields" });
        }

        // ✅ Insert into Supabase
        const { data, error } = await supabase
        .from("rides")
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
                current_lat: origin_lat, // start from origin
                current_lng: origin_lng,
            },
        ])
        .select();

        if (error) throw error;

        return res
        .status(201)
        .json({ message: "Ride added successfully", ride: data?.[0] });
    } catch (err: any) {
        console.error("❌ Error adding ride:", err.message);
        return res.status(500).json({ error: "Failed to add ride" });
    }
});

/**
 * PUT /api/rides/:id/location
 * Update the driver's current location
 */
router.put("/:id/location", async (req, res) => {
    try {
        const { id } = req.params;
        const { current_lat, current_lng } = req.body;

        if (!current_lat || !current_lng) {
            return res.status(400).json({ error: "Missing coordinates" });
        }

        const { data, error } = await supabase
        .from("rides")
        .update({ current_lat, current_lng })
        .eq("id", id)
        .select();

        if (error) throw error;

        return res
        .status(200)
        .json({ message: "Location updated", ride: data?.[0] });
    } catch (err: any) {
        console.error("❌ Error updating location:", err.message);
        return res.status(500).json({ error: "Failed to update location" });
    }
});

/**
 * DELETE /api/rides/:id
 * (Optional) Remove a ride — useful for cleaning up finished rides
 */
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase.from("rides").delete().eq("id", id);
        if (error) throw error;

        return res.status(200).json({ message: "Ride deleted successfully" });
    } catch (err: any) {
        console.error("❌ Error deleting ride:", err.message);
        return res.status(500).json({ error: "Failed to delete ride" });
    }
});

export default router;

