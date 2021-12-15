import { Client } from '@elastic/elasticsearch'
const client = new Client({ node: 'http://elasticsearch:9200' })
import fs from "fs";

export async function searchData(request, indexName) {
    const result = await client.search({
        index: indexName,
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
    return result;
}

export function base64_encode(file) {
    console.log("encodage")
    // read binary data
    let bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    let data = Buffer.from(bitmap);
    let encodedData = data.toString('base64');
    return encodedData;
}

export async function indexDoc(file, indexName) {
    const contents = base64_encode(file);

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
    return res;
}

export async function createIndex(indexName) {
    const res = await client.indices.create({
        index: indexName,
        body: {
            settings: {
                index: {
                    number_of_replicas: 0
                }
            }
        }
    });
    return res;
}

export async function putPipeline() {
    const res = await client.ingest.putPipeline({
        id: "attachment",
        body: {
            processors : [
                {
                    attachment : {
                        field : "data"
                    }
                }
            ]
        }
    })
    console.log(res);
}