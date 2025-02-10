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

// Configure CORS to allow requests from your frontend
app.use(cors({
  origin: ["http://localhost:5173","https://wpharmacy.netlify.app/"],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

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

// Handle CORS manually for all routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Change "*" to specific domains for security
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Export the app for Vercel
export default app;
