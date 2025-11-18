import  { pool } from './database.js'
import './dotenv.js'
import { watchData } from './data/data.js'


// Each Table needs its own function

const createUsersTable = async () => {
    const userQuery = `
        CREATE TABLE IF NOT EXISTS users (

        id serial PRIMARY KEY,
        name text NOT NULL,
        email text UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        password_hash text
    );
    `;
    try {
        const res = await pool.query(userQuery);
        console.log('🔗 Users Table Created with OAuth2.0 Github');
    } catch (err) {
        console.error('Users Table creation unsucessful', err);
        
    }
}
const alterUsersTable = async () => {
    try {
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS github_id TEXT UNIQUE;
        `);
        await pool.query(`
            ALTER TABLE users 
            ALTER COLUMN email DROP NOT NULL;
        `);
        await pool.query(`
            ALTER TABLE users 
            ALTER COLUMN password_hash DROP NOT NULL;
        `);
        console.log("🔧 Users Table Altered (github_id ensured)");
    } catch (err) {
        console.error("Users Table ALTER failed:", err);
    }
};


const createWatchesTable = async () => {
    const watchesQuery = `
        CREATE TABLE IF NOT EXISTS watches (

        id serial PRIMARY KEY,
        brand_id integer NOT NULL,
        price double precision NOT NULL,
        name text NOT NULL,
        description text NOT NULL,
        image_url text,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (brand_id) REFERENCES brands(id)
        ); 
    `;
    try {
        const res = await pool.query(watchesQuery);
        console.log('🔗 Watches Table Created');
    } catch (err) {
        console.error('Watches Table creation unsucessful', err);
        
    }
}

const createBrandsTable = async () => {
    const brandQuery = `
        CREATE TABLE IF NOT EXISTS brands (

        id serial PRIMARY KEY,
        name text NOT NULL,
        country text NOT NULL,
        founded_yr bigint NOT NULL,
        logo_url text
        );

    `;
    try {
        const res = await pool.query(brandQuery);
        console.log('🔗 Brands Table Created');
    } catch (err) {
        console.error('Brands Table creation unsucessful', err);
        
    }
}


const createReviewsTable = async () => {
    const reviewQuery = `
        CREATE TABLE IF NOT EXISTS reviews (

        id serial PRIMARY KEY,
        watch_id integer NOT NULL,
        user_id integer NOT NULL,
        rating integer NOT NULL,
        review_description text NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (watch_id) REFERENCES watches(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
        ); 
        `;
    try {
        const res = await pool.query(reviewQuery);
        console.log('🔗 Reviews Table Created');
    } catch (err) {
        console.error('Reviews Table creation unsucessful', err);
        
    }
}

const createWishlistTable = async () => {
    const wishlistQuery = `
        CREATE TABLE IF NOT EXISTS wishlists (

        id serial PRIMARY KEY,
        watch_id integer NOT NULL,
        user_id integer NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (watch_id) REFERENCES watches(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ); 

  
    `;
    try {
        const res = await pool.query(wishlistQuery);
        console.log('🔗 Wishlist Table Created');
    } catch (err) {
        console.error('Wishlist Table creation unsucessful', err);
    }
}

const initalize_insertDB = async () => {
    await createUsersTable();
    await alterUsersTable();
    await createBrandsTable();
    await createWatchesTable();
    await createReviewsTable();
    await createWishlistTable();
    try {
        for (const wt of watchData) {
            const brand = wt.brand 
            const brandInsert = await pool.query(
            `INSERT INTO brands (id, name, country, founded_yr, logo_url)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (id) DO NOTHING
            RETURNING id`,
            [brand.id, brand.name, brand.country_code || 'Unknown', brand.year_established, brand.logo]
            );
            const brandID = brandInsert.rows[0]?.id || brand.id;

            await pool.query(
                `INSERT INTO watches (id, brand_id, price, name, description, image_url, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
                 ON CONFLICT (id) DO NOTHING`,
                [
                  wt.wb.id,
                  brandID,
                  parseFloat(brand.pricerange_start) || 0,
                  wt.name,
                  wt.description,
                  wt.images[0] || null
                ]
              );
            }


            console.log('✅ Brand and Watch data inserted successfully');
        } catch (err) {
            console.error('Trouble inserting data', err)
        }


}



initalize_insertDB();



// Handle Insertion of users, reviews and wishlist in their respective controllers
// Reason is that these are dynamic data and changes with every API request 