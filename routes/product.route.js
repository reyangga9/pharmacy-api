const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

//  Route untuk menambahkan produk
router.post("/add", productController.addProduct);
router.get("/",productController.getAllProducts)

module.exports = router;
