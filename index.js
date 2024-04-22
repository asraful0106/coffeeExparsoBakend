const express = require('express');
const corse = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;



// middleWare
app.use(corse());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zpodq7w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // -------------Creating Database---------------

    const coffee = client.db("myDB").collection("coffeeExparsoShop");


    // ---------------Creating Request-----------------

    // Getting all Coffee
    app.get('/coffee', async(req, res) =>{
      const cursor = coffee.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // Getting a single Coffe
    app.get('/coffee/:id', async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffee.findOne(query);
      res.send(result);
    })

    // Deleting a single Coffee
    app.delete('/coffee/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffee.deleteOne(query);
      res.send(result);
    })

    // Updating Coffe
    app.put('/coffee/:id', async(req,res) =>{
      const id = req.params.id;
      const clientData = req.body;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updatedData = {
        $set: {
          name: clientData.name,
          supplier: clientData.supplier,
          category: clientData.category,
          chef: clientData.chef,
          test: clientData.test,
          details: clientData.details,
          photo: clientData.photo
        }
      }
      const result = await coffee.updateOne(filter, updatedData, options);
      res.send(result);
    })



    // Adding new Coffee
    app.post('/add-new-coffee', async(req, res) =>{
      const newCoffee = req.body;
      // console.log(newCoffee);
      const result = await coffee.insertOne(newCoffee);
      res.send(result);
    })

    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) =>{
    res.send("Server is running");
})

app.listen(port, () =>{
    console.log(`server is runing on port: ${port}`);
})