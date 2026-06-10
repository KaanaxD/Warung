import fs from "fs-extra";
import path from "node:path";
import sharp from "sharp";

export async function webpConvert(filePath: string) {
    try {
        const outputPath = filePath.replace(path.extname(filePath), ".webp")
        await sharp(filePath).resize(1200).webp({ quality: 75 }).toFile(outputPath)
        fs.removeSync(filePath)
        return filePath.replace(path.extname(filePath), ".webp").split("\\")[1]        
    } catch (error) {
        throw error
    }
}