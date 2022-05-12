const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require('mongodb');
const express = require('express');
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

        // get items to database 
        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = collection.find(query);
            const inventoryItems = await cursor.toArray();
            res.send(inventoryItems);
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