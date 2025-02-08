const Product = require("../models/product.model");

exports.addProduct = async (req, res) => {
    try {
        const { product_name, sell_price } = req.body;

        // Cek apakah produk sudah ada
        const existingProduct = await Product.findOne({ product_name });
        if (existingProduct) {
            return res.status(400).json({ message: "Product already exists" });
        }

        // Buat produk baru
        const newProduct = new Product({
            product_name,
            sell_price
        });

        await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: newProduct });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(201).json({ message: "Product added successfully", product: products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};