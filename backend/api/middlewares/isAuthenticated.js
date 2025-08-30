import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
    const token = req.cookies?.jwt;
    if (!token) {
        return res.status(401).json({ message: "Authentication required, No Cookie" });
      }
    
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
      } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
      }
}