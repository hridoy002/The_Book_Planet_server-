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



app.get('/', (req, res) => {
    res.send('Book planet server running')
});

app.listen(port, () => {
    console.log('server condition is good')
})