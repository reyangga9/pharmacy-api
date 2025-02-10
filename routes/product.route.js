import express from "express";
const router = express.Router();
import productController from "../controllers/product.controller.js";


//  Route untuk menambahkan produk
router.post("/add", productController.addProduct);
router.post("/addBulk", productController.addProductsBulk);
router.get("/",productController.getAllProducts)

export default router;
