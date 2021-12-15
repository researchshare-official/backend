import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import dotenv from 'dotenv'
// require('./search_engine')
import {searchData, indexDoc, createIndex, putPipeline} from "./search_engine";
import e from "express";
import multer from "multer";
import * as os from "os";

dotenv.config({ path: 'backend.env' });
dotenv.config({ path: 'db.env' });

const fileUpload = require('express-fileupload');
const upload = multer({ dest: os.tmpdir() });
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
app.use(fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 10 * 1024 * 1024 * 1024 //2MB max file(s) size
    },
}));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

//Search on all index files
app.get('/search', async (req, res) => {
    await searchData(req.query.text, 'researchshare').then(value => {
        res.send(value);
    }).catch(e => {
        res.send({result: "error"});
    });
})

//Add a file to index
app.post('/index_file', upload.single('file'), async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            console.log("requ")
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let toindex = req.files["file"];

            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            toindex.mv('/tmp/' + toindex.name);

            //send response
            await indexDoc(os.tmpdir() + '/' + toindex.name, 'researchshare').then(value => {
                console.log(value);
                res.send(value);
            }).catch(e => {
                console.log("fail")
                console.log(e);
                res.send({result: "error"});
            })
        }
    } catch (err) {
        res.status(500).send(err);
    }
})

//This command first to initialise
app.get('/initialise', async (req, res) => {
    createIndex("researchshare").then(value => {
        console.log("created index");
        putPipeline().then(r => console.log("putPipeline"));
    });
})

app.listen(port, () => {
    console.log(`server is running on this port ${port}`)
})
