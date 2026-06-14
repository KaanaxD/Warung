import express from "express";
import itemController from "../controllers/item.controller";
import { upload } from "../config/upload";

export const itemRouter = express.Router()
itemRouter.get("/",itemController().getAll)
itemRouter.get("/search",itemController().searchItem)
itemRouter.get("/:id",itemController().getItem)

itemRouter.post("/",upload.single("image"),itemController().postItem)

itemRouter.put("/:id",upload.single("image"),itemController().putItem)
itemRouter.delete("/:id",itemController().deleteItem)

itemRouter.patch("/:id/upload",upload.single("image"),itemController().uploadItemImg )