import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

const app = express()

app.use(express.json())
app.use(cors())

// Route
app.get('/', (req, res) => {
    res.send('Server is running')
})

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
