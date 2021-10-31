const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;


//use middleware
app.use(cors());
app.use(express.json());

//mongodb uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lyhqa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('tourism');
        const collection = database.collection('service');
        const bookingCollection = database.collection('booking');

        //get api
        app.get('/services', async (req, res) => {
            const cursor = collection.find({});
            const services = await cursor.toArray();
            res.json(services)
        })

        //get single data from mongodb api
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            const qurey = { _id: ObjectId(id) }

            const service = await collection.findOne(qurey);
            res.json(service)
        })

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await collection.insertOne(service);
            res.json(result)
        })






/*--------------------------------------------------
            booking site
---------------------------------------------------*/
 
        //post booking service
        app.post('/booking', async (req, res) => {
            const booking = req.body.data;
            booking.status = false;
            booking.url = req.body.url;
            const result = await bookingCollection.insertOne(booking);
            res.json(result)
        })

        //get booking  service
        app.get('/booking', async (req, res) => {
            const cursor = bookingCollection.find({});
            const booking = await cursor.toArray();
            res.json(booking)
        })

        //get delete booking
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.json(result)
        })

        //status update
        app.put('/booking', async (req, res) => {
            const result = await bookingCollection.updateOne({ _id: ObjectId(req.body._id) }, { $set: { status: req.body.task } }, { upsert: true })
            res.json(result)
        })

        //getEmail
        app.post('/booking/email', async (req, res) => {
            const products = await bookingCollection.find({email:req.body.email}).toArray();
            res.json(products)
        })

    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Welcome to tourism server')
})

app.listen(port, () => {
    console.log('Running tourism server', port)
})