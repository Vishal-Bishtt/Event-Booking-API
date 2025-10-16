import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routers.js";
import passport from "./config/passport.js";
import eventRoutes from "./modules/events/event.router.js";
import bookingRoutes from "./modules/bookings/booking.router.js";
dotenv.config();

const app = express();

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

app.use("/api/bookings",bookingRoutes);


export default app;