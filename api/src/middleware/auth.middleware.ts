import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthUser extends Request {
    user?: { 
        user_id: string;
        username: string;
    }
}

export interface CustomJwt extends JwtPayload {
    user_id: string;
    username: string;
}

export function verifyToken(req: AuthUser, res: Response, next: NextFunction) {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "token is required" });

    jwt.verify(token, process.env.JWT_KEY || 'secret_key', (error: any, decoded: any) => {
        if (error) return res.status(403).json({ message: "invalid access token" });
        
        const payload = decoded as CustomJwt;
        
        req.user = {
            user_id: payload.user_id,
            username: payload.username
        }

        next();
    });
}