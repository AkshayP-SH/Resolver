import { rateLimit } from 'express-rate-limit'

export const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 100,
        standardHeaders: 'draft-7',
        legacyHeaders: false,
        message: { message: 'too many requests, slow down.' }

    })
export const authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 10,
        standardHeaders: 'draft-7',
        legacyHeaders: false,
        message: { message: 'too many attempts, try again in 15 minutes.' }
})