import express from "express"
import itemController from "../controllers/itemController"

export const veiwRouter = express.Router()

veiwRouter.get("/",itemController().getAll)
veiwRouter.get("/:id",itemController().getItem)