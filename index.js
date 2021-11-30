var express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const app = express();
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ha5cn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db("travel_place");
        const travelCollection = database.collection('place')
        const myService = database.collection('myPortfolio')

        // GET total Api



        app.get('/myservice', async (req, res) => {
            const cursor = myService.find({});
            const product = await cursor.toArray();
            res.send(product);
        })

        app.get("/myservice/:id", async (req, res) => {
            const id = req.params.id;
            console.log("hitting id", id);
            const query = { _id: ObjectId(id) };
            const product = await myService.findOne(query)
            res.json(product);
        });


        app.get('/service', async (req, res) => {
            const cursor = travelCollection.find({});
            const travels = await cursor.toArray();
            res.send(travels);
        })

        // post api
        app.post("/service", async (req, res) => {
            const travels = req.body;
            console.log("hit the post", travels);

            const result = await travelCollection.insertOne(travels);
            console.log(result);

            res.json(result)
        })
    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("hello world my first word")
});

app.listen(port, () => {
    console.log("server running heroku", port);
})