const neo4j = require('neo4j-driver')
const uri = 'bolt://neo4j:7687';
const user = 'neo4j';

export async function createNode(category, name, title) {
    const driver = neo4j.driver(uri, neo4j.auth.basic(user))
    const session = driver.session()
    const cypher = `CREATE (n:${category} {name: '${name}', title: '${title}'})`;
    let result = null;

    try {
        result = await session.run(cypher);
        result.records.map(el => {
            console.log(el._fields);
        });
    } finally {
        await session.close();
    }
    await driver.close();
    return result;
}

export async function createDocumentNode(category, title) {
    const driver = neo4j.driver(uri, neo4j.auth.basic(user))
    const session = driver.session()
    const cypher = `CREATE (n:Document {category: '${category}', title: '${title}'})`;
    let result = null;

    try {
        result = await session.run(cypher);
        result.records.map(el => {
            console.log(el._fields);
        });
    } finally {
        await session.close();
    }
    await driver.close();
    return result;
}

export async function getRelationships(name, nbToReturn) {
    const driver = neo4j.driver(uri, neo4j.auth.basic(user))
    const session = driver.session()
    const cypher = `MATCH p=()-[r:${name}]->() RETURN p LIMIT ${nbToReturn}`;
    let result = null;

    try {
        result = await session.run(cypher);
        result.records.map(el => {
            console.log(el._fields);
        });
    } finally {
        await session.close();
    }
    await driver.close();
    return result;
}

export async function makeRelationDocAuthor(name1, name2) {
    const driver = neo4j.driver(uri, neo4j.auth.basic(user))
    const session = driver.session();
    const cypher = `MATCH
                    (a:Searcher),
                    (b:Document)
                  WHERE a.name = '${name1}' AND b.title = '${name2}'
                  CREATE (a)-[r:WROTE]->(b)
                  RETURN type(r)`;
    let result = null;

    try {
        result = await session.run(cypher);
        result.records.map(el => {
            console.log(el._fields);
        });
    } finally {
        await session.close();
    }
    await driver.close();
    return result;
}

export async function getNodes(category, nbToReturn) {
    const driver = neo4j.driver(uri, neo4j.auth.basic(user))
    const session = driver.session();
    const cypher = `MATCH (n:${category}) RETURN n LIMIT ${nbToReturn}`;
    let result = null;

    try {
        result = await session.run(cypher);
        result.records.map(el => {
            console.log(el._fields);
        });
    } finally {
        await session.close();
    }
    await driver.close();
    return result;
}

export async function a() {
    let res = null;

    res = await createNode("Searcher", "Castaner", "Ministre");
    console.log("RES = ", res);
    res = await createDocumentNode("Civil", "Les délinquants");
    console.log("RES = ", res);
    res = await makeRelationDocAuthor("Castaner", "Les délinquants");
    res = await getNodes("Searcher", 5);
    console.log("RES = ", res);
    res = await getRelationships("WROTE", 25);
    console.log("RES = ", res);
}