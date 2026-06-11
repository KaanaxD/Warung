import rateLimit from "express-rate-limit";

export default function rateLimiter(){
    return{
        generalRateLimiter: rateLimit({
            windowMs:60000 * 15,
            limit: 1000,
            legacyHeaders: false,
            standardHeaders: true,
            message:{
                status: 429,
                message: "to many request, try again later"
            }
        }),
        auhtRateLimiter: rateLimit({
            windowMs:60000 * 15,
            limit: 10,
            legacyHeaders: false,
            standardHeaders: true,
            message:{
                status: 429,
                message: "apasih obok obok login panel, coba lagi nanti ye"
            }
        })
    }
}