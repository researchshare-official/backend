const express = require('express')
const app = express()

const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })

const fs = require('fs');

app.get('/', (req,res) => {
  res.send('Hello World')
})

app.get('/health',(req,res) => {
  res.send('I')
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
