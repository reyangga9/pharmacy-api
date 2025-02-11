import Transaction from "../models/transaction.model.js";
import Supplier from "../models/supplier.model.js";
import SupplierProduct from "../models/supplier.product.models.js";
import PharmacyItemDetails from "../models/pharmacy_item_detail.model.js";


export const createTransaction = async (req, res) => {
  try {
    const { id_supplier, products, amount_paid } = req.body;

    // Check if the supplier exists
    const supplier = await Supplier.findById(id_supplier);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    let total_transaction_price = 0;
    let validatedProducts = [];

    for (let item of products) {
      const { id_product, quantity, price_per_unit } = item;

      // Check if the product is supplied by the supplier
      const supplierProduct = await SupplierProduct.findOne({ id_supplier, id_product });
      if (!supplierProduct) {
        return res.status(400).json({
          message: `Product with ID ${id_product} is not supplied by this supplier.`,
        });
      }

      total_transaction_price += quantity * price_per_unit;
      validatedProducts.push({ id_product, quantity, price_per_unit });

      // Check if the product exists in PharmacyItemDetails, update or create accordingly
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

    // ✅ Initialize the payment history with the first payment
    const amount_paid_history = amount_paid > 0 ? [{ amount: amount_paid, date: new Date() }] : [];

    const transaction = new Transaction({
      id_supplier,
      products: validatedProducts,
      amount_paid,
      amount_paid_history, // Store initial payment history
      total_transaction_price,
      is_completed,
    });

    await transaction.save();
    res.status(201).json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    res.status(500).json({ message: "Error creating transaction", error: error.message });
  }
};


export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("id_supplier", "supplier_name").sort({ purchase_date: -1 }); // Sort by newest transaction first;
    

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id)
      .populate("id_supplier", "supplier_name address")
      .populate("products.id_product", "product_name"); // Populate product_name from Product model

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Modify the transaction object before sending the response
    const formattedTransaction = {
      _id: transaction._id,
      id_supplier: transaction.id_supplier,
      purchase_date: transaction.purchase_date,
      total_qty: transaction.total_qty,
      total_transaction_price: transaction.total_transaction_price,
      amount_paid: transaction.amount_paid,
      amount_paid_history: transaction.amount_paid_history.map((history) => ({
        amount: history.amount,
        date: history.date,
      })),
      is_completed: transaction.is_completed,
      products: transaction.products.map((product) => ({
        product_name: product.id_product.product_name,
        quantity: product.quantity,
        price_per_unit: product.price_per_unit,
      })),
    };

    res.status(200).json(formattedTransaction);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transaction", error: error.message });
  }
};






export const updateAmountPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount_paid } = req.body;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

  
    transaction.amount_paid_history.push({ amount: amount_paid });


    transaction.amount_paid += amount_paid;


    transaction.is_completed = transaction.amount_paid >= transaction.total_transaction_price;

    await transaction.save();

    res.status(200).json({
      message: "Amount paid updated successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating amount paid", error: error.message });
  }
};



export default {
  updateAmountPaid,
  getTransactionById,
  getAllTransactions,
  createTransaction,
};
