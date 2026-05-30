import { NextFunction, Request, Response } from "express"

interface Err extends Error {
    status: number
}

interface ResBody{
    status:number,
    success:boolean,
    message:string
}

export function createError(status: number, message: string) {
    const err = new Error(message) as Err
    err.status = status
    return err
}

export function errorHandler(err: Err, req: Request, res: Response<ResBody>, next: NextFunction):void{
    res.status(err.status||500).json({
        status: err.status||500,
        success: false,
        message: err.message
    })
}