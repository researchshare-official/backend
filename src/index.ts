import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import dotenv from 'dotenv'
import passport from 'passport'

import localStrategy from './strategies/local'

import authRoutes from './routes/auth'

dotenv.config({ path: 'backend.env' });
dotenv.config({ path: 'db.env' });

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(cookieParser(process.env.SESSION_SECRET))
app.use(passport.initialize())
app.use(passport.session())

localStrategy(passport);

app.use('/auth', authRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})