import rateLimit from "express-rate-limit";

// IP-based rate limiter
export const ipLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // limit each IP to 3 requests per windowMs
    message: { message: "Too many requests in a minute, wait for a minute and retry." },
    standardHeaders: true,
    legacyHeaders: false,
});

export const postLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 2, // limit each IP to 2 requests per windowMs
    message: { message: "Too many requests in a minute, wait for a minute and retry." },
    standardHeaders: true,
    legacyHeaders: false,
});