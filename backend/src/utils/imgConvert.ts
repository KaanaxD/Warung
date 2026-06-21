import fs from "fs-extra";
import path from "node:path";
import sharp from "sharp";
import { createError } from "../middlewares/errorHandler";

export async function webpConvert(filePath: string) {
    try {
        const ext = path.extname(filePath)
        if(ext!=".png" && ext!=".jpg" && ext!=".jpeg"){
            fs.removeSync(filePath)
            throw createError(400,"format lu salah");
        }
        const outputPath = filePath.replace(ext, ".webp")
        await sharp(filePath).resize(1200).webp({ quality: 75 }).toFile(outputPath)
        fs.removeSync(filePath)
        return filePath.replace(path.extname(filePath), ".webp").split("\\")[1]        
    } catch (error) {
        throw error
    }
}