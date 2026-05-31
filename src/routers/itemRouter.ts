import express from "express";
import * as ctr from "../controllers/itemController";
export let itemRouter = express.Router()

itemRouter.get("/",ctr.getAll)
itemRouter.get("/:id",ctr.getItem)

itemRouter.post("/",ctr.postItem)

itemRouter.put("/:id",ctr.putItem)
itemRouter.delete("/:id",ctr.deleteItem)

// itemRouter.put("/:id/upload")