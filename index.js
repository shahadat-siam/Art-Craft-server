const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

//------ middlewere ----
app.use(cors())
app.use(express.json())
  
 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ot34xl4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const craftCollection = client.db('craftDB').collection('craft')
    const defaultCollection = client.db('craftDB').collection('default') 
 
    app.post('/addcraft', async (req, res) => {
        const newCraft = req.body
        const result = await craftCollection.insertOne(newCraft)
        res.send(result)
      })
    

    // // --- get all data from database  
    app.get('/addcraft', async (req, res) => {
      const cursor = craftCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    }) 
    
    //---- get default data from database ----
    app.get('/default', async (req, res) => {
      const cursor = defaultCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    
    //---- get spesific data by id-----
    app.get('/addcraft/:id', async (req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await craftCollection.findOne(query)
      res.send(result)
    })

      // ----- update oparation -------
      app.put('/addcraft/:id', async (req, res) => { 
        const id = req.params.id
        const filter = {_id: new ObjectId(id)} 
        const options = {upsert: true}
        const updateCraft = req.body
        const  Craft = {
          $set: {
            name: updateCraft.name, 
            subcategory: updateCraft.subcategory,
            price: updateCraft.price,
            rating: updateCraft.rating,
            customization: updateCraft.customization,
            description: updateCraft.description,
            time: updateCraft.time,
            stockStatus: updateCraft.stockStatus,
            photo: updateCraft.photo,
          }
        }
        const result = await craftCollection.updateOne(filter,Craft, options)
        res.send(result)
    }) 

    //---- get my data by email-----
    app.get('/mylist/:email', async (req, res) => {
        const email = req.params.email
        const result = await craftCollection.find({email}).toArray()
        res.send(result)

    })  
    

    // delete oparation
    app.delete('/mylist/:id', async (req,res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await craftCollection.deleteOne(query)
      res.send(result)
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


app.get('/', (req, res) => {
    res.send('We are going to make an Art & Craft Store website.')
})

app.listen(port, () => {
    console.log(`Art & Craft Store website running on port ${port}`)
})