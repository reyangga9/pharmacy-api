import mongoose from "mongoose";

const supplierProductSchema = new mongoose.Schema({
  id_supplier: { type: String, required: true }, // Changed to String
  id_product: { type: String, ref: "Product", required: true } // Changed to String
});

export default mongoose.model("SupplierProduct", supplierProductSchema);
