import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDb } from "../config/dbconfig.js";
import cors from "cors";
import supplier from "../routes/supplier.route.js";
import product from "../routes/product.route.js";
import transaction from "../routes/transaction.route.js";
import pharmacy_details from "../routes/pharmacy_item_details.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Vercel Express!");
});

app.use("/api/supplier", supplier);
app.use("/api/product", product);
app.use("/api/transaction", transaction);
app.use("/api/pharmacy_details", pharmacy_details);

// Ensure database connection
connectDb();

// Export the app for Vercel
export default app;
