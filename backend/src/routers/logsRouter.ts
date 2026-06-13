import express from "express"
import logController from "../controllers/logController"
export let logsRouter = express.Router()

logsRouter.get("/",logController().getAllLog)
logsRouter.get("/:id",logController().getLogById)
logsRouter.get("/item",logController().getLogByItemId)