import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  id_supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
  purchase_date: { type: Date, default: Date.now },
  products: [
    {
      id_product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price_per_unit: { type: Number, required: true }
    }
  ],
  amount_paid: { type: Number, default: 0 },
  total_qty: { type: Number },
  total_transaction_price: { type: Number },
  is_completed: { type: Boolean, default: false }
});

TransactionSchema.pre("validate", function (next) {
  this.total_qty = this.products.reduce((sum, item) => sum + item.quantity, 0);
  this.total_transaction_price = this.products.reduce(
    (sum, item) => sum + item.quantity * item.price_per_unit,
    0
  );

  this.is_completed = this.amount_paid >= this.total_transaction_price;

  next();
});

export default mongoose.model("Transaction", TransactionSchema);
