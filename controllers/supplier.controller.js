import Supplier from "../models/supplier.model.js";
import Product from "../models/product.model.js";
import SupplierProduct from "../models/supplier.product.models.js";

export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    console.log(suppliers)
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addSupplier = async (req, res) => {
  try {
    const { _id, supplier_name, address, phone_number } = req.body;

    let newId = _id; // Use the provided _id if available
    if (!newId) {
      const lastSupplier = await Supplier.findOne().sort({ _id: -1 });

      if (lastSupplier) {
        const lastIdNumber = parseInt(lastSupplier._id.substring(1)); 
        const nextIdNumber = lastIdNumber + 1;
        newId = `S${nextIdNumber.toString().padStart(3, "0")}`;
      } else {
        newId = "S001"; // Default if no supplier exists
      }
    }

    const newSupplier = new Supplier({
      _id: newId,
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

export const deleteSupplierById = async (req,res) =>{
  try {
    const { id } = req.params;

    const deletedSupplier = await Supplier.findByIdAndDelete(id);

    if (!deletedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting supplier", error: error.message });
  }
}

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
          products: { _id:1,product_name: 1, sell_price: 1 }
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
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    const supplierProducts = await SupplierProduct.find({ id_supplier: supplierId })
      .populate({
        path: "id_product",
        select: "product_name sell_price"
      });
    const response = {
      _id: supplier._id,
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

export const addNewSupplierWithProducts = async (req, res) => {
  try {
    let { _id, supplier_name, address, phone_number, products } = req.body;

    // ✅ Check if supplier already exists by name
    const existingSupplier = await Supplier.findOne({ supplier_name });

    if (existingSupplier) {
      return res.status(400).json({
        message: `Supplier "${supplier_name}" already exists with ID: ${existingSupplier._id}`
      });
    }

    // ✅ Auto-generate `_id` for Supplier if not provided
    if (!_id) {
      const lastSupplier = await Supplier.findOne().sort({ _id: -1 });

      if (lastSupplier && /^S\d+$/.test(lastSupplier._id)) {
        const lastIdNumber = parseInt(lastSupplier._id.substring(1), 10);
        _id = `S${(lastIdNumber + 1).toString().padStart(3, "0")}`;
      } else {
        _id = "S001";
      }
    }

    // ✅ Create new supplier
    const newSupplier = new Supplier({ _id, supplier_name, address, phone_number });
    await newSupplier.save();

    // ✅ Process Products (Reuse existing, create if new)
    const createdProducts = await Promise.all(
      products.map(async (product, index) => {
        let existingProduct = await Product.findOne({ product_name: product.product_name });

        if (existingProduct) {
          return existingProduct; // ✅ Use existing product
        } else {
          // ✅ Auto-generate `_id` for new Products
          const lastProduct = await Product.findOne().sort({ _id: -1 });

          let lastProductNumber = 0;
          if (lastProduct && /^P\d+$/.test(lastProduct._id)) {
            lastProductNumber = parseInt(lastProduct._id.substring(1), 10);
          }

          let productId = `P${(lastProductNumber + index + 1).toString().padStart(3, "0")}`;
          const newProduct = new Product({
            _id: productId,
            product_name: product.product_name,
            sell_price: product.sell_price
          });

          return newProduct.save();
        }
      })
    );

    // ✅ Create SupplierProduct entries (only if not already linked)
    const supplierProducts = await Promise.all(
      createdProducts.map(async (product) => {
        const exists = await SupplierProduct.findOne({
          id_supplier: newSupplier._id,
          id_product: product._id
        });

        if (!exists) {
          return new SupplierProduct({
            id_supplier: newSupplier._id,
            id_product: product._id
          }).save();
        }
        return null;
      })
    );

    res.status(201).json({
      message: "Supplier and products processed successfully",
      supplier: newSupplier,
      products: createdProducts.filter(Boolean),
      supplierProducts: supplierProducts.filter(Boolean)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






// Edit supplier details & products
export const editSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const { supplier_name, address, phone_number, products } = req.body;

    // Find the supplier
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Update supplier details
    supplier.supplier_name = supplier_name || supplier.supplier_name;
    supplier.address = address || supplier.address;
    supplier.phone_number = phone_number || supplier.phone_number;
    await supplier.save();

    // Remove existing supplier-product relations
    await SupplierProduct.deleteMany({ id_supplier: id });

    // Add new supplier-product relations
    const supplierProducts = [];

    if (products && products.length > 0) {
      for (const product of products) {
        let existingProduct = await Product.findOne({ product_name: product.name });

        if (!existingProduct) {
          // Create a new product if it doesn't exist
          existingProduct = new Product({
            product_name: product.name,
            sell_price: product.price,
          });
          await existingProduct.save();
        }

        // Create a new supplier-product relation
        supplierProducts.push({
          id_supplier: id,
          id_product: existingProduct._id,
        });
      }

      await SupplierProduct.insertMany(supplierProducts);
    }

    // Fetch updated supplier details with products
    const updatedSupplier = await Supplier.findById(id);
    const updatedProducts = await SupplierProduct.find({ id_supplier: id }).populate({
      path: "id_product",
      select: "product_name sell_price",
    });

    res.status(200).json({
      message: "Supplier updated successfully",
      supplier: updatedSupplier,
      products: updatedProducts.map((sp) => ({
        _id: sp.id_product._id, // Existing ID if name matches, new ID otherwise
        name: sp.id_product.product_name,
        price: sp.id_product.sell_price,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating supplier", error: error.message });
  }
};



export default {
  getAllSuppliers,
  addSupplier,
  addProductToSupplier,
  getAllSuppliersWithProducts,
  getOneSupplierWithProducts,
  addNewSupplierWithProducts,deleteSupplierById,editSupplierById
};
