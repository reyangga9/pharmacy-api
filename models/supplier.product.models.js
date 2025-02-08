const mongoose = require("mongoose");

const SupplierProductSchema = new mongoose.Schema({
 id_supplier: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Supplier" },
  id_product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" }
  });
  
  module.exports = mongoose.model("SupplierProduct", SupplierProductSchema);
  