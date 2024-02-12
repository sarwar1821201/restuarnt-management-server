const express= require('express')
const app = express()
const cors= require('cors')
require('dotenv').config()
const port= process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w8gsdns.mongodb.net/?retryWrites=true&w=majority`;

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

    const database= client.db('restuDb');
    const menuCollection= database.collection('menu')
    const reviewsCollection=client.db('restuDb').collection('reviews')
    const cartsCollection=client.db('restuDb').collection('carts')

   
    app.get('/menu', async(req,res)=> {
         const result= await menuCollection.find().toArray();
         res.send(result)
    } )

    app.get('/reviews', async(req,res)=> {
        const result= await reviewsCollection.find().toArray();
        res.send(result)
   } )

  // get cart item from database

    app.get('/carts' , async(req,res)=> {
        const email= req.query.email;
      //  console.log(email)
        if(!email){
          res.send([])
        }
         const query= {email: email}
         const result= await cartsCollection.find(query).toArray();
         res.send(result)
    } )

    // cart collection

      app.post('/carts', async(req,res) =>{
          const item= req.body;
          console.log(item)
           const result= await cartsCollection.insertOne(item);
           res.send(result)
      }  )

   // delete an item

   app.delete('/carts/:id', async(req,res)=>{
        const id= req.params.id;
        const query= {_id: new ObjectId (id) }
        const result= await cartsCollection.deleteOne(query)
        res.send(result)
   }  )


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);



app.get( '/', (req,res) => {
     res.send('restuarnt server is running')
} )

app.listen( port, ()=> {
     console.log(`server running on : ${port}`)
}  )