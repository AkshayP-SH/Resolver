import "dotenv/config";
import express from "express";
import connectDB from "./src/config/db.js";
import cors from "cors";
import router from "./src/routers/auth.router.js";


const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;

async function startserver() {
  try{
    await connectDB();
    app.use("/api/auth",router);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  } catch (e) {
    console.error("theres a db error or auth error",e);
    process.exit(1);
  }

}


app.get("/", (req, res) => {
  res.send("HI");
});

startserver();
