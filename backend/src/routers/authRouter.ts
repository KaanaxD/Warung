import express from "express";
import { login } from "../controllers/authController";
export let authRouter = express.Router()

authRouter.post("/login",login)