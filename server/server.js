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
import { Github, Local } from "./config/auth.js";
import { pool } from "./config/database.js"; 



const app = express();

const PORT = process.env.PORT || 3000;


app.use(cors({
    origin: 'https://client-c4by.onrender.com',
    credentials: true,
  }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


  
app.use(session({
    secret: process.env.SESSION_SECRET || 'luxe-timeless',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      httpOnly: true
    }
  }));
  
  
  
app.use(passport.initialize())
app.use(passport.session())


passport.use(Github)
passport.use(Local)


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



