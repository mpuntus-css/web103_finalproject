import { pool } from '../config/database.js'



export const createUser = async (req, res) => {
    try {
        const {name, pass, email} = req.body;
        const result = await pool.query(`
            INSERT INTO users (name, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING *;
        
        `, [name, email, pass]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error inserting User: ', err);
        res.status(500).send({error: 'ISE (Internal Server Error'});
    }
}

export const getUsers = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT id, name, email, created_at
            FROM users
            ORDER BY id ASC;

            `
        )
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching Users: ', err);
        res.status(500).send({error: 'ISE (Internal Server Error'});
    }
}

export const getUserByID = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `
            SELECT id, name, email, created_at
            FROM users
            WHERE id = $1;
            `, [id]
        )
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching user by ID: ', err);
        res.status(500).send({error: 'ISE (Internal Server Error'});
    }

}

export const updateUser = async (req, res) => { // PATCH REQUEST
    const { id } = req.params;
    const { name, email, pass } = req.body;

    try {
        const fields = [];
        const values = [];
        let index = 1;

        if (name) {
            fields.push(`name = $${index++}`);
            values.push(name);
        }

        if (email) {
            fields.push(`email = $${index++}`);
            values.push(email);
        }

        if (pass) {
            fields.push(`password_hash = $${index++}`);
            values.push(pass);
        }

        if (fields.length === 0) {
            return res.status(400).json({ error: "No fields provided to update" });
        }
        values.push(id);

        const sql = `
            UPDATE users
            SET ${fields.join(", ")}
            WHERE id = $${index}
            RETURNING id, name, email, created_at;
        `;

        const result = await pool.query(sql, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ error: "ISE (Internal Server Error)" });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `
            DELETE FROM users 
            WHERE id = $1
            RETURNING *;

            
            `, [id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
   
        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ error: "ISE (Internal Server Error)" });
    }
    
}
