import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import dotenv from 'dotenv'
import passport from 'passport'
import { PrismaSessionStore } from '@quixo3/prisma-session-store'

import localStrategy from './strategies/local'

import authRoutes from './routes/auth'
import profileRoutes from './routes/profile'
// require('./search_engine')
import {searchData, indexDoc, createIndex, putPipeline, checkIndex} from "./search_engine";
import {createNode, createDocumentNode, getRelationships, makeRelationDocAuthor, getNodes, a} from "./neo4j"
import prisma from './prisma'
import multer from "multer";
import * as os from "os";
import fs from "fs";

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

app.use('/profile', profileRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/neo4j', (req, res) => {
    a()
    res.send('Test neo4j!')
})

//Search on all index files
app.get('/search', async (req, res) => {
    await searchData(req.query.text, 'researchshare').then(value => {
        res.send(value);
    }).catch(e => {
        res.send(null);
    });
})

app.post('/create_nodes', async (req, res) => {
    try {
        console.log("REQ = ", req);
        let res = await createNode("Searcher", req.query.author, "test");
        console.log(res);
        res = await createDocumentNode(req.query.category, req.query.title);
        console.log(res);
        res= await makeRelationDocAuthor(req.query.author, req.query.title);
        console.log(res);
    } catch (err) {
        res.status(500).send(err);
    }
})

app.get('/get_relations', async (req, res) => {
    try {
        let resu = await getRelationships("WROTE", 25);
        console.log(resu);
        res.send(resu)
    } catch (err) {
        res.status(500).send(err);
    }
})

app.get('/rawArticle', async (req, res) => {
    var data = fs.readFileSync('./' + req.query.articleName, {encoding: 'base64'});
    res.contentType("application/pdf");
    res.send(data);
})

//Add a file to index
app.post('/index_file', upload.single('file'), async (req, res) => {
    try {
        let indexIsCreated = await checkIndex("researchshare");
        if (indexIsCreated == 404) {
            console.log("create index")
            await createIndex("researchshare");
            await putPipeline().then(r => console.log("putPipeline"));
        } else
            console.log("index already exists")
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let toindex = req.files["file"];

            //TODO: DO NOT PUBLISH BECAUSE OF THIS : this allows an exploit to override certain files on the docker container in real time. Must do that because elastic search sucks at removing the path of the name.
            await toindex.mv('/app/' + toindex.name);

            await indexDoc(toindex.name, 'researchshare').then(value => {
                console.log(value);
                res.send(value);
            }).catch(e => {
                console.log("fail")
                res.send({result: "error"});
            })
        }
    } catch (err) {
        res.status(500).send(err);
    }
})

//This command first to initialise
// app.get('/initialise', async (req, res) => {
//     createIndex("researchshare").then(value => {
//         console.log("created index");
//         putPipeline().then(r => console.log("putPipeline"));
//     });
// })

app.listen(port, () => {
    console.log(`server is running on this port ${port}`)
})
