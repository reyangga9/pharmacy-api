import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // ✅ Custom transaction ID (T001, T002, etc.)
    id_supplier: { type: String, ref: "Supplier", required: true },
    purchase_date: { type: Date, default: Date.now },
    products: [
      {
        id_product: { type: String, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price_per_unit: { type: Number, required: true },
      },
    ],
    amount_paid: { type: Number, default: 0 },
    amount_paid_history: [
      {
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    total_qty: { type: Number },
    total_transaction_price: { type: Number },
    is_completed: { type: Boolean, default: false },
  },
  { versionKey: false } // ✅ Remove __v field
);

// 🔥 Prevent Mongoose from auto-generating _id for subdocuments in `products`
TransactionSchema.path("products").schema.set("_id", false);

// ✅ Automatically generate a unique _id before saving
TransactionSchema.pre("save", async function (next) {
  if (!this._id) {
    const lastTransaction = await mongoose.model("Transaction").findOne().sort({ _id: -1 });

    let transactionId = "T001"; // Default if no transactions exist
    if (lastTransaction && lastTransaction._id.startsWith("T")) {
      const lastIdNumber = parseInt(lastTransaction._id.substring(1)); // Extract numeric part
      transactionId = `T${String(lastIdNumber + 1).padStart(3, "0")}`; // Increment and format
    }

    this._id = transactionId; // ✅ Assign custom _id
  }

  next();
});

// ✅ Calculate total quantity, total price, and is_completed before saving
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
