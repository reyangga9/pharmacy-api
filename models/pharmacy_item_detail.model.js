const mongoose = require("mongoose");

const PharmacyItemDetailsSchema = new mongoose.Schema({
   
  id_product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    total_quantity: { type: Number, required: true },
    sell_price: { type: Number, required: true }, 
  });
  
  module.exports = mongoose.model("PharmacyItemDetails", PharmacyItemDetailsSchema);
  