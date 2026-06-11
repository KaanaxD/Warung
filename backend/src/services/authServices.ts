import { sign } from "jsonwebtoken";
import { createError } from "../middlewares/errorHandler";

export function verifyUser(username:string,password:string){
    if(username != process.env.ADMIN_USERNAME || password != process.env.ADMIN_PASS){
        throw createError(401,"username atau password salah")
    }
    let token = sign({
        username: process.env.ADMIN_USERNAME,
    } as AdminPayload, process.env.JWT_SECRET as string, {
        expiresIn: "1d"
    })
    return token
}

