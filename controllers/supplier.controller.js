import Supplier from "../models/supplier.model.js";
import Product from "../models/product.model.js";
import SupplierProduct from "../models/supplier.product.models.js";


export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addSupplier = async (req, res) => {
  try {
    const { supplier_name, address, phone_number } = req.body;
    const newSupplier = new Supplier({
      supplier_name,
      address,
      phone_number
    });
    await newSupplier.save();
    res.status(201).json({ message: "Supplier added successfully", supplier: newSupplier });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addProductToSupplier = async (req, res) => {
  try {
    const { id_supplier, id_product } = req.body;

    const supplier = await Supplier.findOne({ _id: id_supplier });
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    const product = await Product.findOne({ _id: id_product });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const supplierProduct = new SupplierProduct({
      id_supplier,
      id_product,
    });

    await supplierProduct.save();
    res.status(201).json({ message: "Product added to supplier successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllSuppliersWithProducts = async (req, res) => {
  try {
    const suppliersWithProducts = await Supplier.aggregate([
      {
        $lookup: {
          from: "supplierproducts",
          localField: "_id",
          foreignField: "id_supplier",
          as: "supplierProducts"
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "supplierProducts.id_product",
          foreignField: "_id",
          as: "products"
        }
      },
      {
        $project: {
          supplier_name: 1,
          address: 1,
          phone_number: 1,
          products: { product_name: 1, sell_price: 1 }
        }
      }
    ]);

    res.status(200).json(suppliersWithProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOneSupplierWithProducts = async (req, res) => {
  try {
    const supplierId = req.params.id;

    // Find the supplier by its ID
    const supplier = await Supplier.findById(supplierId);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Find the SupplierProduct entries that link to this supplier
    const supplierProducts = await SupplierProduct.find({ id_supplier: supplierId })
      .populate({
        path: "id_product",
        select: "product_name sell_price"
      });

    const response = {
      _id :supplier._id,
      name: supplier.supplier_name,
      address: supplier.address,
      phone: supplier.phone_number,
      products: supplierProducts.map(supplierProduct => ({
        _id: supplierProduct.id_product._id,
        name: supplierProduct.id_product.product_name,
        price: supplierProduct.id_product.sell_price

      }))
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getAllSuppliers,
  addSupplier,
  addProductToSupplier,
  getAllSuppliersWithProducts,
  getOneSupplierWithProducts
};

