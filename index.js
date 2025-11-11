const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
const uri =
  "mongodb+srv://habitTracker:7HVB4FTBegcbYMNr@cluster0.myy7mcl.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("smart server is running");
});

async function run() {
  try {
    await client.connect();

    const db = client.db("habitTracker");
    const modelCollection = db.collection("allHabits");

    app.get("/allHabits", async (req, res) => {
      const result = await modelCollection.find().toArray();
      console.log(result);
      res.send(result);
    });
    app.get("/allHabits/:id", async (req, res) => {
      const { id } = req.params;
      const objectId = new ObjectId(id);
      const result = await modelCollection.findOne({ _id: objectId });
      res.send(result);
    });
    app.post("/allHabits", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await modelCollection.insertOne(data);
      res.send({
        success: true,
        result,
      });
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);
app.listen(port, () => {
  console.log(`smart server is running on port ${port}`);
});
