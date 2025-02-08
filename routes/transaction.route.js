const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");

router.post("/", transactionController.createTransaction);
router.get("/", transactionController.getAllTransactions);
router.get("/:id", transactionController.getTransactionById);
router.put("/:id/amount-paid", transactionController.updateAmountPaid);

module.exports = router;
