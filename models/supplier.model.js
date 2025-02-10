import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema({
  supplier_name: { type: String, required: true },
  address: { type: String, required: true },
  phone_number: { type: String, required: true },
});

export default mongoose.model("Supplier", SupplierSchema);
