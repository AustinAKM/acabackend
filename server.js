
// Import dependencies modules:
const express = require('express')
// const bodyParser = require('body-parser')

// Create an Express.js instance:
const app = express()
// config Express.js
app.use(express.json())
app.set('port', 3000)
app.use ((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    next();
})

// connect to MongoDB
const { MongoClient, ObjectId } = require('mongodb');


let db;
//MongoClient.connect('mongodb+srv://MyMongoDBUser:wednesday@cluster0.epqbr.mongodb.net', (err, client) => {
 //   db = client.db('webstore')
//})
MongoClient.connect('mongodb+srv://austin_db:austindb123@cluster0.auvne.mongodb.net/',)
    .then(client => {
        db = client.db('aca');
        console.log("Connected to MongoDB successfully!");
        app.listen(app.get('port'), () => {
            console.log('⁠Express.js server running at localhost:3000');
        });
    })
    .catch(err => {
        console.log("Error connecting to MongoDB:", err);
        process.exit(1); // Exit process if DB connection fails
    });


// dispaly a message for root path to show that API is working
app.get('/', (req, res, next) => {
    res.send('Select a collection, e.g., /collection/messages')
})

// get the collection name
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    // console.log('collection name:', req.collection)
    return next()
})


// retrieve all the objects from an collection
app.get('/collection/:collectionName', async (req, res, next) => {
    try {
        const results = await req.collection.find({}).toArray();
        console.log("Get Success");
        res.json(results);
    } catch (err) {
        console.log("Get Failed");
        next(err);
    }
    }
);


    
    // return with object id 
    
    const ObjectID = require('mongodb').ObjectID;
    app.get('/collection/:collectionName/:id'
    , (req, res, next) => {
    req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
    if (e) return next(e)
    res.send(result)
    })
    })
    
    
    //update an object 
    
    app.post('/collection/:collectionName', async (req, res, next) => {
        try {
            const result = await req.collection.insertOne(req.body);
            res.json(result.ops);
        } catch (err) {
            next(err);
            }
        }
    );
    
    app.put('/collection/:collectionName/:id', async (req, res, next) => {
        try {
            const result = await req.collection.updateOne(
                { _id: new ObjectId(req.params.id) }, 
                { $set: req.body }
            );
            res.json(result.modifiedCount === 1 ? { msg: 'success' } : { msg: 'error' });
        } catch (err) {
            next(err);
            }
        }
    );
    
    
    
    
    
    
    app.delete('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.deleteOne(
    { _id: ObjectID(req.params.id) },(e, result) => {
    if (e) return next(e)
    res.send((result.result.n === 1) ?
    {msg: 'success'} : {msg: 'error'})
    })
    })
    
    

app.listen(3000, () => {
    console.log('Express.js server running at localhost:3000')
})
