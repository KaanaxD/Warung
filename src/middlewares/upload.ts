import multer from "multer";
import path from "node:path";

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "uploads/")
    },
    filename(req, file, callback) {
        let ext = path.extname(file.originalname)
        callback(null, Date.now().toString() + ext)
    },
})

export const upload = multer({
    storage
})