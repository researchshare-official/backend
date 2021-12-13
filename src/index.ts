import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import dotenv from 'dotenv'
import fs from "fs";

dotenv.config({ path: 'backend.env' });
dotenv.config({ path: 'db.env' });

const app = express()
const port = process.env.PORT || 3000

const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })

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

app.get('/search', async (req, res) => {
    const a = await searchData('return');
})

app.get('/index', async (req, res) => {
    const a = await indexDoc('../../First_Year/Maths/101pong_2019/101pong');
})

async function searchData(request) {
    const result = await client.search({
        index: 'my-index-000001',
        body: {
            query: {
                term: {
                    'attachment.content': request
                }
            }
        }
    })
    console.log(result.body);
    if (result.body.hits.total.value > 0) {
        result.body.hits.hits.map(el => {
            console.log(el._source.fileName);
        });
    } else {
        console.log("No result");
    }
}

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

async function indexDoc(file) {
    const contents = base64_encode(file);
    const indexName = "my-index-000001";

    const res = await client.index({
        index: indexName,
        pipeline: "attachment",
        body: {
            fileName: file,
            data : contents
        }
    });
    console.log(res);
    await client.indices.refresh({ index: indexName });
}

app.listen(8000,() => {
    console.log("Server up and running")
})
