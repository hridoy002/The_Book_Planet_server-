const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require('mongodb');
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;
// dotenv 
require("dotenv").config();
// cors 
const cors = require('cors');
// middlewear 
app.use(cors());
app.use(express.json());

// mongodb connection 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xi0ip.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const collection = client.db("the_book_planet").collection("items");
        const selectCollection = client.db("the_book_planet").collection("select");

        // get items to database 
        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = collection.find(query);
            const inventoryItems = await cursor.toArray();
            res.send(inventoryItems);
        })

        // get individual product id 
        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await collection.findOne(query);
            res.send(item);
        })


        // myitem get data 
        app.get('/select', async(req,res)=>{
            const email = req.query.email;
            
            const query ={email:email};
            const cursor = selectCollection.find(query);
            const myitems = await cursor.toArray();
            res.send(myitems)
        })

        //select item post
        app.post('/select', async (req, res) => {
            const select = req.body;
            const result = await selectCollection.insertOne(select);
            res.send(result);
        })

        // post api 
        app.post('/items', async (req, res) => {
            const books = req.body;
            console.log('Adding new book');
            const result = await collection.insertOne(books);
            res.send({ result: 'Book added' })
        })

        // update quantity
        app.put('/items/:id', async(req, res) => {
            const id = req.params.id;
            const updateQuantity = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updated = {
                $set: {
                    quantity: parseInt(updateQuantity.quantity)-1,
                }
            };

            const result = await collection.updateOne(filter,updated, options);
            res.send(result);
        })

        //delete item
        app.delete('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await collection.deleteOne(query);
            res.send(result);
        })

        //delete my item
        app.delete('/select/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await selectCollection.deleteOne(query);
            res.send(result);
        })

        // login jwt security 
        app.post('/login', async(req,res) =>{
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "1hr"
            });
            res.send(accessToken)
        })
    }
    finally { }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Book planet server running')
});

app.listen(port, () => {
    console.log('server condition is good')
})