const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const MongoClient = require("mongodb").MongoClient;


const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



// mongodb connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ncbah.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try{
        await client.connect();
        const database = client.db('motion_capture');
        const camerasCollection = database.collection("cameras");
        const ordersCollection = database.collection('orders');
        const usersCollection = database.collection('users');
        


        // add camera product
        app.post("/addCamera", async(req, res) => {
        const result = await camerasCollection.insertOne(req.body);
        res.send(result);
        }); 

        // get camera products
          app.get("/cameras", async (req, res) => {
            const result = await camerasCollection.find({}).toArray();
            res.send(result);
        });

        // get single product
        app.get("/singleCamera/:id", async(req, res) => {
          const result = await camerasCollection
              .find({_id: ObjectId(req.params.id)})
              .toArray();
          res.send(result[0]);
        });     

        // add order
        app.post('/addOrder', async (req, res) => {
          const order = req.body;
          const result = await ordersCollection.insertOne(order);
          res.json(result);
        })

        // get purchases
        app.get('/orders',async (req, res) => {
         
            const cursor = ordersCollection.find({})
            const orders = await cursor.toArray();
            res.json(orders)
  
        })


        // myOrder confirmation
          app.get("/myOrders/:email", async (req, res) => {
            const result = await ordersCollection
                .find({ email: req.params.email })
                .toArray();
                res.send(result); 
        });

        // delete 
          app.delete("/delete/:id", async (req, res) => {
            const result = await ordersCollection.deleteOne({_id: ObjectId(req.params.id)});
            const result1 = await camerasCollection.deleteOne({_id: ObjectId(req.params.id)});
            res.send(result);
            res.send(result1);
        });
            // manage Orders
              app.get("/manageOrder", async(req, res) => {
                const result = await ordersCollection.find({}).toArray();
                res.send(result);
            });

        

            //update status
              app.put("/updateStatus/:id", (req, res) => {
                const id = req.params.id;
                const updateStatus = req.body.status;
                const filter = { _id: ObjectId(id)};
                console.log(updateStatus);
                purchasesCollection.updateOne(filter, {
                    $set: {status: updateStatus},
                })
                .then(result => {
                    res.send(result);
                });

            })

            // Users
            app.post('/users', async(req, res) => {
              const user = req.body;
              const result = await usersCollection.insertOne(user);
              console.log(result);
              res.json(result);
            })


            app.put('/users', async (req, res) => {
              const user = req.body;
              const filter = {email:user.email};
              const options = { upsert: true };
              const updateDoc = { $set: user};
              const result = await usersCollection.updateOne(filter, updateDoc, options);
              res.json(result);
            })

            // justify admin 
            // app.get('/users/:email', async (req, res) => {
            //   const email = req.params.email;
            //   const query = {email: email};
            //   const user = await usersCollection.findOne(query);
            //   let isAdmin = false;
            //   if (user?.role === 'admin') {
            //     isAdmin = true;
            //   }
            //   res.json({ admin: isAdmin});
            // })

            // justify admin using jwt token
            // app.put('/users/admin', verifyToken, async (req, res) => {
            //   const user = req.body;
            //   const requester = req.decodedEmail;
            //   if(requester) {
            //     const requesterAccount = await usersCollection.findOne({email: requester});
            //     if(requesterAccount.role === 'admin'){
            //       const filter = {email: user.email};
            //       const updateDoc = { $set: { role: 'admin'}};
            //       const result = await usersCollection.updateOne(filter, updateDoc);
            //       res.json(result);
            //     }
            //   }
            //   else {
            //     res.status(403).json({ message: 'You do not hold the right to make an admin'})
            //   }    
            // })
 
    }
    finally {
        // await client.close();
    }
}


run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('The server is running.');
});

app.listen(port, () => {
    console.log(`Server running at ${port}`);
})