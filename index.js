const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();


// middleware

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pmnkpyg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


const coffeeCollection = client.db("coffeeDB").collection("coffee");

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })


        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.findOne(query);
            res.send(result)
        })


        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee)
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result);

        });

        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedCoffee = req.body;
            const coffee = {
                $set: {
                    name: updatedCoffee.name,
                    quantity: updatedCoffee.quantity, chef: updatedCoffee.chef, 
                    supplier: updatedCoffee.supplier, test: updatedCoffee.test, 
                    category: updatedCoffee.category, details: updatedCoffee.details, photo: updatedCoffee.photo,

                },
            }
            const result =await coffeeCollection.updateOne(filter,coffee, options );
            res.send(result)
        })


        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.deleteOne(query);
            res.send(result);
        })




    } finally {

    }
}
run().catch(console.dir);







app.get('/', (req, res) => {
    res.send('coffee store server is running')
});

app.listen(port, () => {
    console.log(`Coffee server is running on port ${port}`)
})