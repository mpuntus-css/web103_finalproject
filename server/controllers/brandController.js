import { pool } from '../config/database.js';


export const getBrands = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM brands ORDER BY name ASC`);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching brands:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getBrandById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM brands WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Brand not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error fetching brand:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// export const deleteBrand = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const result = await pool.query(
//             `DELETE FROM brands WHERE id = $1 RETURNING *`,
//             [id]
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: "Brand not found" });
//         }

//         res.status(200).json({ message: "Brand deleted", brand: result.rows[0] });
//     } catch (err) {
//         console.error("Error deleting brand:", err);
//         res.status(500).json({ error: "ISR"})
//     }
// }
