const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://elasticsearch:9200' })
import fs from "fs";

export async function se_searchData(request) {
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

export async function se_indexDoc(file) {
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