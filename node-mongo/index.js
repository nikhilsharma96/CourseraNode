const MongoClient = require('mongodb');
const assert = require('assert');
const dboper = require('./operations');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

MongoClient.connect(url).then((client)=>{

    console.log('Connected correctly to the server');

    const db = client.db(dbname);
    
    dboper.insertDocument(db,{name: "Vadonut", description: "Test"}, 'dishes').then ((result)=>{

        console.log('Insert Document:\n',result.ops);

        return dboper.findDocument(db, 'dishes'); 
    })
        .then((docs)=>{

            console.log('Found Documents:\n',docs);

            return dboper.updateDocument(db, {name: 'Vadonut'}, {description: 'Updated test'}, 'dishes')
        })   
        .then((result)=>{

            console.log("Updated document:\n", result.result);
        
            return dboper.findDocument(db, 'dishes');
        })     
        .then((docs)=>{
            
            console.log('Found Updated Documents:\n',docs);

            return db.dropCollection('dishes')
        })
        
        .then((result)=>{
                        
            console.log('Dropped the collection: ',result);
                        
            client.close();
       })
       .catch((err)=>{
            console.log(err);
        });
    })
.catch((err)=>{
    console.log(err);
})