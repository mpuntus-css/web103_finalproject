import { pool } from '../config/database.js'


export const createReview = async (req, res) => {
    const { user_id, watch_id, rating, review_description } = req.body;
    try {
        const result = await pool.query(`
            INSERT INTO reviews (user_id, watch_id, rating, review_description)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
            `, [user_id, watch_id, rating, review_description]);
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error('Error creating review for user: ',err);
        res.status(500).send({error: "ISR creation"});
    }

}

export const getReviews = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                r.id AS review_id,
                r.rating,
                r.review_description,
                r.created_at,
                u.id AS user_id,
                u.name AS user_name,
                u.email AS user_email,
                w.id AS watch_id,
                w.name AS watch_name,
                w.brand_id
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            JOIN watches w ON r.watch_id = w.id
            ORDER BY r.created_at DESC;
        `);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getReviewsByUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                r.id AS review_id,
                r.rating,
                r.review_description,
                r.created_at,
                w.id AS watch_id,
                w.name AS watch_name,
                w.brand_id
            FROM reviews r
            JOIN watches w ON r.watch_id = w.id
            WHERE r.user_id = $1
            ORDER BY r.created_at DESC;
        `, [user_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No reviews found for this user" });
        }

        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching reviews by user:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getReviewsByWatch = async (req, res) => {
    const { watch_id } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                r.id AS review_id,
                r.rating,
                r.review_description,
                r.created_at,
                u.id AS user_id,
                u.name AS user_name,
                u.email AS user_email
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.watch_id = $1
            ORDER BY r.created_at DESC;
        `, [watch_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No reviews found for this watch" });
        }

        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching reviews by watch:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const getReviewByID = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                r.id,
                r.rating,
                r.review_description,
                r.created_at,
                u.id AS user_id,
                u.name AS user_name,
                u.email AS user_email,
                w.id AS watch_id,
                w.name AS watch_name,
                w.brand_id
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            JOIN watches w ON r.watch_id = w.id
            WHERE r.id = $1;
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Review not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error fetching review by ID with join:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const updateReview = async (req, res) => {
    const { id } = req.params;
    const { rating, review_description, user_id, watch_id } = req.body;

    try {
        const fields = [];
        const values = [];
        let index = 1;

        if (rating !== undefined) {
            fields.push(`rating = $${index++}`);
            values.push(rating);
        }

        if (review_description) {
            fields.push(`review_description = $${index++}`);
            values.push(review_description);
        }

        if (user_id) {
            fields.push(`user_id = $${index++}`);
            values.push(user_id);
        }

        if (watch_id) {
            fields.push(`watch_id = $${index++}`);
            values.push(watch_id);
        }

        if (fields.length === 0) {
            return res.status(400).json({ error: "No fields provided to update" });
        }

        values.push(id);

        const sql = `
            UPDATE reviews
            SET ${fields.join(", ")}
            WHERE id = $${index}
            RETURNING *;
        `;

        const result = await pool.query(sql, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Review not found" });
        }

        res.status(200).json({
            message: "Review updated successfully",
            review: result.rows[0]
        });

    } catch (err) {
        console.error("Error updating review:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



export const deleteReview = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
            DELETE FROM reviews
            WHERE id = $1
            RETURNING *;
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Review not found" });
        }

        res.status(200).json({
            message: "Review deleted successfully",
            review: result.rows[0]
        });
    } catch (err) {
        console.error("Error deleting review:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
