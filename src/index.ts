import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import dotenv from 'dotenv'

dotenv.config({ path: 'backend.env' });
dotenv.config({ path: 'db.env' });

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
app.use(cookieParser(process.env.SESSION_SECRET))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})