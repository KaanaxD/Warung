import { Request,Response,NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { createError } from "./errorHandler";

export function auth(req:Request,res:Response,next:NextFunction){
    let bearerToken = req.headers.authorization
    if(!bearerToken){
        return next(createError(401,"Belum login"))
    }
    let token = bearerToken.split(" ")[1]
    try {
        let user = verify(token as string,process.env.JWT_SECRET as string)
        req.admin = user as AdminPayload
    } catch (error) {
        return next(createError(401,"invalid token"))
    }
    next()
 
}