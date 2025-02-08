const express = require("express");
const router = express.Router();

const supplierController = require("../controllers/supplier.controller")


// Ambil semua supplier
router.get("/", supplierController.getAllSuppliers);

// Ambil semua supplier dengan product
router.get("/product", supplierController.getAllSuppliersWithProducts);

// ambil 1 supplier aja dengan product
router.get("/:id/product", supplierController.getOneSupplierWithProducts);

//Tambahh supplier aja
router.post("/add-supplier", supplierController.addSupplier);

// tambah product di supplier
router.post("/add-product", supplierController.addProductToSupplier);





module.exports = router;