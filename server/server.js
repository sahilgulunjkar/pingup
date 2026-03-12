import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './configs/db.js'

dotenv.config()

const app = express()

await connectDB();

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Server is running')
})

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
