const Transaction = require("../models/transaction.model");
const Supplier = require("../models/supplier.model");
const Product = require("../models/product.model");
const SupplierProduct = require("../models/supplier.product.models");
const PharmacyItemDetails = require("../models/pharmacy_item_detail.model");

exports.createTransaction = async (req, res) => {
  try {
    const { id_supplier, products, amount_paid } = req.body;
    
    const supplier = await Supplier.findById(id_supplier);3
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    let total_transaction_price = 0;
    let validatedProducts = [];

    for (let item of products) {
      const { id_product, quantity, price_per_unit } = item;

      const supplierProduct = await SupplierProduct.findOne({ id_supplier, id_product });
      if (!supplierProduct) {
        return res.status(400).json({
          message: `Product with ID ${id_product} is not supplied by this supplier.`,
        });
      }

      total_transaction_price += quantity * price_per_unit;
      validatedProducts.push({ id_product, quantity, price_per_unit });

      const existingItem = await PharmacyItemDetails.findOne({ id_product });

      if (existingItem) {
        existingItem.total_quantity += quantity;
        existingItem.sell_price = price_per_unit;
        await existingItem.save();
      } else {
        await PharmacyItemDetails.create({
          id_product,
          total_quantity: quantity,
          sell_price: price_per_unit,
        });
      }
    }

    const is_completed = amount_paid >= total_transaction_price;

    const transaction = new Transaction({
      id_supplier,
      products: validatedProducts,
      amount_paid,
      total_transaction_price,
      is_completed,
    });

    await transaction.save();
    res.status(201).json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    res.status(500).json({ message: "Error creating transaction", error: error.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("id_supplier", "supplier_name");

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error: error.message });
  }
};

// Get transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id).populate("id_supplier", "supplier_name");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transaction", error: error.message });
  }
};

// Update amount_paid
exports.updateAmountPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount_paid } = req.body;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.amount_paid = amount_paid;
    transaction.is_completed = amount_paid >= transaction.total_transaction_price;

    await transaction.save();

    res.status(200).json({ message: "Amount paid updated successfully", transaction });
  } catch (error) {
    res.status(500).json({ message: "Error updating amount paid", error: error.message });
  }
};
