import PharmacyItemDetails from "../models/pharmacy_item_detail.model.js";
import Product from "../models/product.model.js";

export const getAllPharmacyItemDetails = async (req, res) => {
  try {
    const pharmacyItems = await PharmacyItemDetails.find().populate("id_product", "product_name sell_price");

    const formattedItems = pharmacyItems.map((item) => ({
      _id: item._id,
      id_product: item.id_product._id,
      product_name: item.id_product.product_name, 
      total_quantity: item.total_quantity,
      sell_price: item.sell_price, 
      buy_price: item.id_product.sell_price, 
    }));

    res.status(200).json(formattedItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pharmacy item details", error: error.message });
  }
};

export default {
  getAllPharmacyItemDetails
};
