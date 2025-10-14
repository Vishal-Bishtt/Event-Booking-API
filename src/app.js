import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routers.js";
import passport from "./config/passport.js";
import {protect} from "./middlewares/authMiddleware.js";
import eventRoutes from "./modules/events/event.router.js";
dotenv.config();

const app = express();

// 🔍 GLOBAL REQUEST LOGGER - CATCHES ALL REQUESTS
app.use((req, res, next) => {
    const requestId = Date.now();
    req.requestId = requestId;
    console.log(`\n🌐 [${ requestId}] ========== NEW REQUEST ==========`);
    console.log(`🌐 [${requestId}] ${req.method} ${req.originalUrl}`);
    console.log(`🌐 [${requestId}] Headers:`, req.headers);
    console.log(`🌐 [${requestId}] Body:`, req.body);
    console.log(`🌐 [${requestId}] ========================================\n`);
    
    // Track response
    const originalSend = res.send;
    res.send = function(data) {
        console.log(`\n📤 [${requestId}] ========== RESPONSE SENT ==========`);
        console.log(`📤 [${requestId}] Status: ${res.statusCode}`);
        console.log(`📤 [${requestId}] =====================================\n`);
        originalSend.call(this, data);
    };
    
    next();
});

app.use(cors({origin:"http://localhost:3001", credentials: true}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.get("/",(req,res)=>{
    res.json({message: "Event Booking API is running "});
});

//auth route
app.use("/api/auth",authRoutes);

app.use("/api/events",eventRoutes);

//protected route
app.use("/api/protected",protect,(req,res)=>{
    res.json({message:`Hello ${req.user.name}`})
});

export default app;