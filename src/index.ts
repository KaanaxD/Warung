import "dotenv/config"
import express from 'express'
import { authRouter } from "./routers/authRouter"
import { errorHandler } from "./middlewares/errorHandler"
import { itemRouter } from "./routers/itemRouter"
import { auth } from "./middlewares/auth"
import path from "node:path"
import { veiwRouter } from "./routers/viewRouter"

const app = express()
const port = process.env.PORT

app.use(express.urlencoded())
app.use(express.json())

app.use('/api/img',express.static(path.join(__dirname,"..","uploads")))
app.use('/api/auth',authRouter)
app.use('/api/view/item',veiwRouter)
app.use('/api/admin/item',auth,itemRouter)

app.use(errorHandler)

app.listen(port, () => console.log(`jalan diport ${port}!`))