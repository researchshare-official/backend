import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import dotenv from 'dotenv'
// require('./search_engine')
import {searchData, indexDoc, createIndex, putPipeline} from "./search_engine";

dotenv.config({ path: 'backend.env' });
dotenv.config({ path: 'db.env' });

const app = express()
const port = process.env.PORT || 4000

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

//Search on all index files
app.get('/search', async (req, res) => {
    const a = await searchData('true', 'researchshare');
})

//Add a file to index
app.get('/index', async (req, res) => {
    const a = await indexDoc('tsconfig.json', 'researchshare');
})

//This command first to initialise
app.get('/initialise', async (req, res) => {
    createIndex("researchshare").then(value => {
        console.log("created index");
        putPipeline().then(r => console.log("putPipeline"));
    });
})

app.listen(port, () => {
    console.log(`server is running on freaking port ${port}`)
})
