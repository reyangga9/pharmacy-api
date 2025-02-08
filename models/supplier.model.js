const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  supplier_name: { type: String, required: true },
  address: { type: String, required: true },
  phone_number: { type: String, required: true },
});

module.exports = mongoose.model("Supplier", SupplierSchema);
