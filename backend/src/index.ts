import "dotenv/config"
import express from 'express'
import { authRouter } from "./routers/auth.router"
import { errorHandler } from "./middlewares/errorHandler"
import { itemRouter } from "./routers/item.router"
import { auth } from "./middlewares/auth"
import path from "node:path"
import { viewRouter } from "./routers/view.router"
import rateLimiter from "./config/rateLimiter"
import { logsRouter } from "./routers/logs.router"
import cors from "cors"
const {generalRateLimiter,auhtRateLimiter} = rateLimiter()

const app = express()
const port = process.env.PORT

app.use(cors({
    origin: "http://localhost:5173"
}))
app.use(express.urlencoded())
app.use(express.json())

app.use('/api',generalRateLimiter)
app.use('/api/auth',auhtRateLimiter)

app.use('/api/img',express.static(path.join(__dirname,"..","uploads")))
app.use('/api/auth',authRouter)
app.use('/api/view/item',viewRouter)
app.use('/api/admin/item',auth,itemRouter)
app.use('/api/admin/logs',auth,logsRouter)

app.use(errorHandler)

app.listen(port, () => console.log(`jalan diport ${port}!`))