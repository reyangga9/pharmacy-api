import express from "express";
const router = express.Router();

import supplierController from "../controllers/supplier.controller.js";



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

//tambah supplier dengan products

router.post("/add-supplier-products",supplierController.addNewSupplierWithProducts)



export default router;
