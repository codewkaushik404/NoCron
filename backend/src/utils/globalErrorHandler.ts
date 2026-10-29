import type { Request, Response, NextFunction } from "express"
import ApiError from "./ApiError.js"
import { error } from "node:console";

export default function globalErrorHandler(err: Error, req: Request, res: Response, next: NextFunction){
    const success: boolean = false;

    if(err instanceof ApiError){
        return res.status(err.statusCode).json({
            success,
            statusCode: err.statusCode,
            message: err.message,
            errors: err.errors
        })
    }

    console.error({
        message: err.message,
        stackTrace: err.stack
    });

    return res.status(500).json({
        success,
        statusCode: 500,
        message: "Internal Server Error",
        errors: []    
    })
}