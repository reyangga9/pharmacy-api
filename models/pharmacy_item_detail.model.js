import mongoose from "mongoose";

const PharmacyItemDetailsSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // ✅ Make _id same as id_product
  id_product: { type: String, ref: "Product", required: true }, // ✅ Add reference to Product
  total_quantity: { type: Number, required: true },
  sell_price: { type: Number, required: true }
});

export default mongoose.model("PharmacyItemDetails", PharmacyItemDetailsSchema);
