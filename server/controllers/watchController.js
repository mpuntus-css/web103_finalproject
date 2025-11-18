import { pool } from '../config/database.js'

export const getWatches = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT w.*, b.name AS brand_name, b.logo_url
            FROM watches w
            JOIN brands b on w.brand_id = b.id
            ORDER BY w.id;
        `
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching watches: ", err)
        res.status(500).json({error: "Internal Server Error"})
    }
}

export const getWatchByID = async (req, res) => {
    const { id } = req.params 

    try {
        const result = await pool.query(`
            SELECT w.*, b.name AS brand_name, b.logo_url
            FROM watches w
            JOIN brands b on w.brand_id = b.id
            WHERE w.id = $1;
        `, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({message: "watch not found"})
        }
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching watch by ID: ", err)
        res.status(500).json({error: "Internal Server Error"})
    }
}