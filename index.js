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
      try {
        const result = await modelCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.log("Error fetching all habits:", error);
      }
    });

    app.get("/latestHabits", async (req, res) => {
      const cursor = modelCollection.find().sort({ createdAt: -1 }).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/myHabits", async (req, res) => {
      try {
        const email = req.query.email;
        if (!email) {
          return res.status(400).send({ message: "Email is required" });
        }

        const query = { userEmail: email };
        const result = await modelCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.log("Error fetching user habits:", error);
      }
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
      const newHabit = {
        ...data,
        createdAt: new Date(),
      };
      const result = await modelCollection.insertOne(newHabit);
      res.send({
        success: true,
        result,
      });
    });

    app.put("/allHabits/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      // console.log(id, data);
      const objectId = new ObjectId(id);
      const filter = { _id: objectId };
      const update = {
        $set: data,
      };

      const result = await modelCollection.updateOne(filter, update);

      res.send({
        success: true,
        result,
      });
    });

    app.delete("/allHabits/:id", async (req, res) => {
      const { id } = req.params;
      const result = await modelCollection.deleteOne({ _id: new ObjectId(id) });

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
