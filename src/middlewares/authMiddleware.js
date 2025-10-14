import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    const token = req.cookies.token || 
        (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') 
            ? req.headers.authorization.split(" ")[1] 
            : null);

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
        };
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};