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

exports.addProductsBulk = async (req, res) => {
    try {
        const products = req.body;

        // Check if input is an array
        if (!Array.isArray(products)) {
            return res.status(400).json({ message: "Expected an array of products" });
        }

        // Validate required fields for each product
        for (const product of products) {
            if (!product.product_name || !product.sell_price) {
                return res.status(400).json({ 
                    message: "Each product must have product_name and sell_price" 
                });
            }
        }

        // Check for duplicate names in the request
        const productNames = products.map(p => p.product_name);
        if (new Set(productNames).size !== productNames.length) {
            return res.status(400).json({ message: "Duplicate product names in request" });
        }

        // Check existing products in database
        const existingProducts = await Product.find({ 
            product_name: { $in: productNames } 
        });

        if (existingProducts.length > 0) {
            const existingNames = existingProducts.map(p => p.product_name);
            return res.status(400).json({ 
                message: "Some products already exist",
                existingNames
            });
        }

        // Insert all products
        const newProducts = await Product.insertMany(products);
        
        res.status(201).json({ 
            message: `${products.length} products added successfully`,
            products: newProducts 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(201).json({ message: "", product: products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};