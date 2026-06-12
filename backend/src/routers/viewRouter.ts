import express from "express"
import itemController from "../controllers/itemController"

export const viewRouter = express.Router()

viewRouter.get("/",itemController().getAll)
viewRouter.get("/search",itemController().searchItem)
viewRouter.get("/:id",itemController().getItem)
