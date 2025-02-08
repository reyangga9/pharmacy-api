const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    
    product_name: { type: String, required: true },
    sell_price: { type: Number, required: true },quantity: { type: Number, default: 0 }
    
  });
  
  module.exports = mongoose.model("Product", ProductSchema);
  