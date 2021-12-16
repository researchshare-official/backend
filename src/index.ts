import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import dotenv from 'dotenv'
import passport from 'passport'
import { PrismaSessionStore } from '@quixo3/prisma-session-store'

import localStrategy from './strategies/local'

import authRoutes from './routes/auth'
// require('./search_engine')
import {searchData, indexDoc, createIndex, putPipeline} from "./search_engine";
import prisma from './prisma'
import multer from "multer";
import * as os from "os";

dotenv.config({ path: 'backend.env' });
dotenv.config({ path: 'db.env' });

const fileUpload = require('express-fileupload');
const upload = multer({ dest: os.tmpdir() });
const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
        prisma,
        {
            checkPeriod: 60 * 60 * 1000,
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined
        }
    ),
}))
app.use(cookieParser(process.env.SESSION_SECRET))
app.use(passport.initialize())
app.use(passport.session())

app.use(fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 10 * 1024 * 1024 * 1024 //2MB max file(s) size
    },
}));

localStrategy(passport);

app.use('/auth', authRoutes)

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
            let toindex = req.files["file"];

            //TODO: DO NOT PUBLISH BECAUSE OF THIS : this allows an exploit to override certain files on the docker container in real time. Must do that because elastic search sucks at removing the path of the name.
            await toindex.mv('/app/' + toindex.name);

            await indexDoc(toindex.name, 'researchshare').then(value => {
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
