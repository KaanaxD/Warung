import { NextFunction, Request, Response } from "express"
import { ZodError } from "zod"

interface Err extends Error {
    status: number
}

interface ResBody {
    status: number,
    success: boolean,
    message: string
}

export function createError(status: number, message: string) {
    const err = new Error(message) as Err
    err.status = status
    return err
}

export function errorHandler(err: Err|ZodError, req: Request, res: Response<ResBody>, next: NextFunction){
    if (err instanceof ZodError) {
        return res.json({
            status: 400,
            success: false,
            message: err.issues[0]?.message ?? "Validation error"
        })
    }
    res.status(err.status || 500).json({
        status: err.status || 500,
        success: false,
        message: err.message
    })
}