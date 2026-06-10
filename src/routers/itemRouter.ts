import express from "express";
import itemController from "../controllers/itemController";
export let itemRouter = express.Router()
import { upload } from "../middlewares/upload";

itemRouter.get("/",itemController().getAll)
itemRouter.get("/:id",itemController().getItem)

itemRouter.post("/",itemController().postItem)

itemRouter.put("/:id",itemController().putItem)
itemRouter.delete("/:id",itemController().deleteItem)

itemRouter.post("/:id/upload",upload.single("image"),itemController().uploadItemImg )