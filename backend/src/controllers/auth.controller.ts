import { Request,Response,NextFunction } from "express";
import { verifyUser } from "../services/auth.service";

export function login(req:Request<{},{},LoginBody>,res:Response<ResBody>,next:NextFunction){
    try {
        let token = verifyUser(req.body.username,req.body.password)
        res.json({
            success:true,
            message: "Welcome Admin",
            token: token
        })
    } catch (error) {
        return next(error)
    }
}