import "dotenv/config";
import express from "express";
import connectDB from "./src/config/db.js";

const app = express();
const PORT = process.env.PORT;

async function startserver() {
  try{
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  } catch (e) {
    console.error("DB connection error",e);
    process.exit(1);
  }

}


app.get("/", (req, res) => {
  res.send("HI");
});

startserver();
