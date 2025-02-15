import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Changed to String
  supplier_name: { type: String, required: true },
  address: { type: String, required: true },
  phone_number: { type: String, required: true }
});

export default mongoose.model("Supplier", supplierSchema);
