import express from "express";
import cors from "cors";
import userRoute from "./routes/userRoute.js"
import watchRoute from "./routes/watchRoute.js"
import reviewRoute from "./routes/reviewRoute.js"
import wishlistRoute from "./routes/wishlistRoute.js"
import brandRoute from "./routes/brandRoute.js"
import authRoutes from './routes/auth.js'
import passport from "passport";
import session from "express-session";
import { Github } from "./config/auth.js";
import { pool } from "./config/database.js"; 


const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET,POST,PUT,DELETE,PATCH'],
    credentials: true
}))

app.use(express.json())

app.use(session({
    secret: 'luxe-timeless',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))

app.use(passport.initialize())
app.use(passport.session())


passport.use(Github)


passport.serializeUser((user, done) => {
    done(null, user.id); 
});

passport.deserializeUser(async (id, done) => {
    try {
        const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        done(null, res.rows[0]);
    } catch (err) {
        done(err, null);
    }
});








app.use("/api/users", userRoute);
app.use("/api/watches", watchRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/wishlists", wishlistRoute);
app.use("/api/brands", brandRoute)
app.use('/api/auth', authRoutes)


app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))



