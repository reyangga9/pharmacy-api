import dotenv from "dotenv";
dotenv.config();
import express from "express";
// import cookieParser from "cookie-parser";
import { connectDb } from "./config/dbconfig.js";
import cors from "cors";
import supplier from "./routes/supplier.route.js";
import product from "./routes/product.route.js"
import transaction from "./routes/transaction.route.js"
import pharmacy_details from "./routes/pharmacy_item_details.route.js"

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// app.use("/api/food", foodRoute);
app.use("/api/supplier",supplier)
app.use("/api/product",product)
app.use("/api/transaction",transaction)
app.use("/api/pharmacy_details",pharmacy_details)

app.listen(port, () => {
  connectDb();
  console.log(`server berjalanan di port ${port}`);
});