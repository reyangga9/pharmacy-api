import express from "express";
const router = express.Router();

import supplierController from "../controllers/supplier.controller.js";
import { authenticateUser } from "../middlewares/auth.js";
import { authorizeRole } from "../middlewares/role.js";

router.use(authenticateUser); // 🔥 Now only affects routes BELOW this line

// ✅ Public Routes (No authentication required)
router.get("/", supplierController.getAllSuppliers);
router.get("/product", supplierController.getAllSuppliersWithProducts);
router.get("/:id/product", supplierController.getOneSupplierWithProducts);

// ✅ Protected Routes (Require authentication)


// Only Manager (role = 1) can modify suppliers
router.post("/add-supplier", authorizeRole([1]), supplierController.addSupplier);
router.post("/add-product", authorizeRole([1]), supplierController.addProductToSupplier);
router.post("/add-supplier-products", authorizeRole([1]), supplierController.addNewSupplierWithProducts);
router.put("/:id/edit-supplier", authorizeRole([1]), supplierController.editSupplierById);
router.delete("/:id/delete-supplier", authorizeRole([1]), supplierController.deleteSupplierById);

export default router;
