import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './Policy.config';

export interface AuthRequest extends Request {
    shopId?: string; // Attach shopId to the request
}

export function jwtAuthenticate(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res
            .status(401)
            .json({ message: 'Unauthorized: No token provided' });
    }

    if (!JWT_SECRET) {
        console.error('JWT_SECRET is not defined in environment variables.');
        return res.status(500).json({ message: 'Internal Server Error' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { shopId: string }; // Verify and extract shopId
        req.shopId = decoded.shopId; // Attach shopId to the request
        next(); // Token is valid, proceed
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}
