const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    
    product_name: { type: String, required: true },
    sell_price: { type: Number, required: true }
    
  });
  
  module.exports = mongoose.model("Product", ProductSchema);
  