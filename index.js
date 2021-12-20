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
        console.log('database connected successfully');
    }
    finally{
        // await client.close();
    }
}


run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Motion Capture server is running.');
});

app.listen(port, () => {
    console.log(`Server running at ${port}`);
})