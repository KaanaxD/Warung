import "dotenv/config"
import express from 'express'
import { authRouter } from "./routers/authRouter"
import { errorHandler } from "./middlewares/errorHandler"
import { itemRouter } from "./routers/itemRouter"
import { auth } from "./middlewares/auth"

const app = express()
const port = process.env.PORT

app.use(express.urlencoded())
app.use(express.json())

app.use('/api/auth',authRouter)
app.use('/api/item',auth,itemRouter)

app.use(errorHandler)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))