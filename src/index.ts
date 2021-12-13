import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import dotenv from 'dotenv'
import {se_searchData, se_indexDoc} from "../elasticsearch/search_engine";

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

//Search on all index files
app.get('/search', async (req, res) => {
    const a = await se_searchData('return');
})

//Index a file to add it to elastic search
app.get('/index', async (req, res) => {
    const a = await se_indexDoc('README.md');
})

app.listen(8000,() => {
    console.log("Server up and running")
})
