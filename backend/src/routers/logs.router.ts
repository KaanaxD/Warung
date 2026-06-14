import express from "express"
import logController from "../controllers/log.controller"
export let logsRouter = express.Router()

logsRouter.get("/",logController().getAllLog)
logsRouter.get("/item/:item_id",logController().getLogByItemId)
logsRouter.get("/:id",logController().getLogById)