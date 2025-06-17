import express from "express";
import dotenv from "dotenv";
import GetrateLimiter from "./middleware/rateLimiter.js";
import router from "./routes/transactionsRoute.js";
import { initDB } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
//middlware
app.use(GetrateLimiter);
app.use(express.json());

app.use("/api/transactions", router);

app.get("/api/health", (req, res) => {
  res.send("its working");
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server on PORT", PORT);
  });
});
