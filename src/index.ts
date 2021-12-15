import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import dotenv from 'dotenv'
import {searchData, indexDoc, createIndex, putPipeline} from "../elasticsearch/search_engine";

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

//Search on all index files
app.get('/search', async (req, res) => {
    const a = await searchData('return', 'ResearchShare');
})

app.get('/index', async (req, res) => {
    const a = await indexDoc('tsconfig.json', 'ResearchShare');
})

// app.get('/create', async (req, res) => {
//     //const a = await createIndex('my-index-000002');
//     await putPipeline();
// })

app.listen(8000,() => {
    console.log(`server is running on freaking port ${port}`)
    createIndex("ResearchShare").then(value => {
        console.log("created index");
        putPipeline().then(r => console.log("putPipeline"));
    });
})
