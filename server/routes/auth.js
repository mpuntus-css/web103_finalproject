import express from "express"
import passport from "passport"
import {pool} from '../config/database.js'
import bcrypt from 'bcrypt';


const router = express.Router()


router.get('/login/success', (req, res) => {
    if (req.user) {
        res.status(200).json({ success: true, user: req.user })

    }
})

console.log("Auth routes loaded"); 


router.post('/signup', async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields required" });
    }

    try {
        // Check if user already exists
        const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existing.rows.length > 0) {
        return res.status(400).json({ success: false, message: "Email already registered" });
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 10);

        // Insert user
        const result = await pool.query(
        "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
        [name, email, hashed]
        );

        const user = result.rows[0];

        // Return success
        res.json({ success: true, user });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.get('/login', (req, res) => {
    res.redirect('/api/auth/github'); 
});

router.get('/login/failed', (req, res) => {
    res.status(401).json({ success: true, message: "failure" })
})


router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            return res.json({ success: true });
        });
    });
});


router.get(
    '/github',
    passport.authenticate('github', {
        scope: [ 'read:user', 'user:email' ]
    })
)


router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: 'https://client-c4by.onrender.com/login' }),
    (req, res) => {
        res.redirect('https://client-c4by.onrender.com');

    }
);

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  
      req.login(user, (err) => {
        if (err) return next(err);
        return res.json({ success: true, user });
      });
    })(req, res, next);
  });

export default router;