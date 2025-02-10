import express from "express";
const router = express.Router();
import transactionController from "../controllers/transaction.controller.js";


router.post("/", transactionController.createTransaction);
router.get("/", transactionController.getAllTransactions);
router.get("/:id", transactionController.getTransactionById);
router.put("/:id/amount-paid", transactionController.updateAmountPaid);

export default router;
