import { pool } from '../config/database.js'

export const createWishlistItem = async (req, res) => {
    try {
        const { user_id, watch_id } = req.body;
        console.log("REQUEST BODY =>", req.body);


        const result = await pool.query(`
            INSERT INTO wishlists (user_id, watch_id)
            VALUES ($1, $2)
            RETURNING *;
        `, [user_id, watch_id]);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating wishlist item:", err);
        res.status(500).json({ error: "ISE (Internal Server Error)" });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, user_id, watch_id, created_at
            FROM wishlists
            ORDER BY id ASC;
        `);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching wishlist:", err);
        res.status(500).json({ error: "ISE (Internal Server Error)" });
    }
};

export const getWishlistByUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await pool.query(`
            SELECT id, user_id, watch_id, created_at
            FROM wishlists
            WHERE user_id = $1
            ORDER BY created_at DESC;
        `, [user_id]);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching wishlist for user:", err);
        res.status(500).json({ error: "ISE (Internal Server Error)" });
    }
};

export const updateWishlistItem = async (req, res) => {
    const { id } = req.params;
    const { user_id, watch_id } = req.body;

    try {
        const result = await pool.query(`
            UPDATE wishlists
            SET 
                user_id = COALESCE($1, user_id),
                watch_id = COALESCE($2, watch_id)
            WHERE id = $3
            RETURNING *;
        `, [user_id, watch_id, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Wishlist item not found" });
        }

        res.status(200).json({
            message: "Wishlist item updated successfully",
            item: result.rows[0]
        });
    } catch (err) {
        console.error("Error updating wishlist:", err);
        res.status(500).json({ error: "ISE (Internal Server Error)" });
    }
};


export const deleteWishlistItem = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
            DELETE FROM wishlists
            WHERE id = $1
            RETURNING *;
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Wishlist item not found" });
        }

        res.status(200).json({
            message: "Wishlist item deleted",
            item: result.rows[0]
        });
    } catch (err) {
        console.error("Error deleting wishlist item:", err);
        res.status(500).json({ error: "ISE (Internal Server Error)" });
    }
};

export const deleteWishlistByUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await pool.query(`
            DELETE FROM wishlists
            WHERE user_id = $1
            RETURNING *;
        `, [user_id]);

        res.status(200).json({
            message: "Wishlist cleared",
            deleted_count: result.rowCount
        });
    } catch (err) {
        console.error("Error clearing wishlist:", err);
        res.status(500).json({ error: "ISE (Internal Server Error)" });
    }
};
