import express from "express";
import passport from "../../config/passport.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Google OAuth login
router.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get("/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/api/auth/failure" }),
    (req, res) => {
        const token = jwt.sign(
            {
                id: req.user.id,
                name: req.user.name, 
                email: req.user.email, 
                role: req.user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        
        res.cookie("token", token, { httpOnly: true });
        res.redirect("/api/auth/success");
    }
);

// Success route
router.get("/success", (req, res) => {
    res.json({ message: "Login successful" });
});

// Failure route
router.get("/failure", (req, res) => {
    res.status(401).json({ message: "Login failed" });
});

export default router;

