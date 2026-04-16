import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './configs/db.js'
import { inngest, functions } from "./inngest/index.js"
import { serve } from "inngest/express";
import { clerkMiddleware } from '@clerk/express'
import userRouter from './routes/userRoutes.js'

const app = express()

dotenv.config()

await connectDB();

app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

app.get('/', (req, res) => {
    res.send('Server is running')
})

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/user", userRouter)

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})