import "dotenv/config";
import express from "express";
import connectDB from "./src/config/db.js";
import User from "./src/models/User.js";
import Complaint from "./src/models/Complaint.js";


const app = express();
app.use(express.json());
const PORT = process.env.PORT;

async function startserver() {
  try{
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  } catch (e) {
    console.error("theres a db error",e);
    process.exit(1);
  }

}


app.get("/", (req, res) => {
  res.send("HI");
});

startserver();
