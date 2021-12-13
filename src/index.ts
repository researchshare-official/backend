import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

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

let takevalue = false;
const prisma = new PrismaClient()

async function setup_it() {
      const newUser = await prisma.user.create({
        data: {
          name: 'Alice',
          email: 'alice@prisma.io',
        },
      })
      console.log('Created new user: ', newUser)
}

app.get('/', (req, res) => {
    res.send('Hello World!')
    if (takevalue === false) {
        setup_it().catch((e) => console.error(e)).finally(async () => await prisma.$disconnect())


    }
    takevalue = true;
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})
