import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  sell_price: { type: Number, required: true }
});

export default mongoose.model("Product", ProductSchema);
