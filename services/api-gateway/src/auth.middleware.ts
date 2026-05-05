import { NextFunction, Request, Response } from "express";
import { AppError } from "./utils/appError";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const loginValidation = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization;

        if (!token || !token.startsWith('Bearer ')) {
            throw new AppError(404, "Token is missing or malformed");
        }

        const [, actualToken] = token.split(' ');
        if (!process.env.JWT_SECRET) {
            throw new AppError(400, 'JWT secret is missing');
        }
        const verifyToken = jwt.verify(actualToken, process.env.JWT_SECRET);
        req.user = verifyToken;

        next();
    } catch (error: any) {
        console.log(error);

        res.status(error.message || 500).json({
            message: error.message || "Internal server error",
            success: false,
        })
    }
}