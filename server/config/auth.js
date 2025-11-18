import passport from "passport"
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as LocalStrategy } from 'passport-local';
import { pool } from '../config/database.js'
import bcrypt from 'bcrypt';



const options = {
    clientID: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/github/callback'
}

const verifyUser = async (accessToken, refreshToken, profile, done) => {
    const {_json: { id, name,  login, email} } = profile 

    const userData = {
        githubID: id,
        username: login || name,
        userEmail: email || null,
        accessToken
    }
    try {
        const res = await pool.query(
            `
            SELECT * FROM users
            WHERE github_id = $1;
            `


        , [userData.githubID]);
        const user = res.rows[0];
        if (!user) {
            const results = await pool.query(
                `INSERT INTO users (name, email, github_id)
                VALUES($1, $2, $3)
                RETURNING *`,
                [userData.username, userData.userEmail, userData.githubID])
            
            const newUser = results.rows[0];

            return done(null, newUser)
        }
        console.log('accessToken:', accessToken);
        console.log('profile:', profile);
        return done(null, user)
    } catch (error) {
        console.error("Github OAuth Error: ", error);
        return done(error)

    }

}

export const Local = new LocalStrategy(
    { usernameField: 'email' }, 
    async (email, password, done) => {
      try {
        const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = res.rows[0];
        if (!user) return done(null, false, { message: 'Incorrect email' });
  
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return done(null, false, { message: 'Incorrect password' });
  
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
);


export const Github = new GitHubStrategy(options, verifyUser)
