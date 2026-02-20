const Product = require("../../Models/Marketplace/Web_Product");

// Add Product
exports.addProduct = async (req, res) => {
  try {
    const {
      type,
      color,
      Shape,
      Size,
      Cut,
      intensity,
      Clarity,
      Treatment,
      Origin,
      description,
      price,
    } = req.body;

    if (!type || String(type).trim() === "") {
      return res.status(400).json({ message: "type is required" });
    }
    const priceNum = Number(price);
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      return res.status(400).json({ message: "price must be a positive number" });
    }

    const images = Array.isArray(req.files) && req.files.length > 0
      ? req.files.map((f) => `/uploads/products/${f.filename}`)
      : [];

    const product = new Product({
      type: String(type).trim(),
      color,
      Shape,
      Size,
      Cut,
      intensity,
      Clarity,
      Treatment,
      Origin,
      description,
      price: priceNum,
      image: images,
    });

    await product.save();
    res.json({ message: "Product added successfully", product });
  } catch (err) {
    console.error("addProduct error:", err);
    if (err?.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Error adding product" });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

// Get published products only
exports.getPublishedProducts = async (req, res) => {
  try {
    const products = await Product.find({ published: true }).sort({
      createdAt: -1,
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching published products" });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product" });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (data.price !== undefined) {
      const priceNum = Number(data.price);
      if (Number.isNaN(priceNum) || priceNum <= 0) {
        return res.status(400).json({ message: "price must be a positive number" });
      }
      data.price = priceNum;
    }

    if (req.files && req.files.length > 0) {
      data.image = req.files.map((f) => `/uploads/products/${f.filename}`);
    }

    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    res.json({ message: "Product updated", product });
  } catch (err) {
    console.error("updateProduct error:", err);
    res.status(500).json({ message: "Error updating product" });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product" });
  }
};

// Publish Product
exports.publishProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    product.published = true;
    await product.save();
    res.json({ message: "Product published", product });
  } catch (err) {
    res.status(500).json({ message: "Error publishing product" });
  }
};

// Unpublish Product
exports.unpublishProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    product.published = false;
    await product.save();
    res.json({ message: "Product unpublished", product });
  } catch (err) {
    res.status(500).json({ message: "Error unpublishing product" });
  }
};
