const MongoClient = require('mongodb');
const assert = require('assert');
const dboper = require('./operations');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

MongoClient.connect(url,(err,client)=>{
    assert.equal(err,null);

    console.log('Connected correctly to the server');

    const db = client.db(dbname);
    
    dboper.insertDocument(db,{name: "Vadonut", description: "Test"}, 'dishes', (result)=>{

        console.log('Insert Document:\n',result.ops);

        dboper.findDocument(db, 'dishes', (docs)=>{

            console.log('Found Documents:\n',docs);

            dboper.updateDocument(db, {name: 'Vadonut'}, {description: 'Updated test'}, 'dishes', (result)=>{

                console.log("Updated document:\n", result.result);

                dboper.findDocument(db, 'dishes', (docs)=>{

                    console.log('Found Updated Documents:\n',docs);

                    db.dropCollection('dishes',(result)=>{
                        
                        console.log('Dropped the collection: ',result);
                        
                        client.close();
                   });
                });
            });
        });
    });
});