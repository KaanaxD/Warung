import express from "express";
import { login } from "../controllers/auth.controller";
export let authRouter = express.Router()

authRouter.post("/login",login)