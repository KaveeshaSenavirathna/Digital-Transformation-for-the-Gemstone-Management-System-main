const User = require("../../Models/Marketplace/User");  // 
const Product = require("../../Models/Marketplace/Web_Product")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const user = new User({ name, email, password });
    await user.save();

    res.json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
};

// Get user profile
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // exclude password
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

// Update profile
exports.updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating user" });
  }
};

// Delete profile
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

// ratings
exports.addRating = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ message: "Rating must be between 1 and 5" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existingRatingIndex = product.ratings.findIndex(r => r.user.toString() === userId);

    if (existingRatingIndex !== -1) {
      product.ratings[existingRatingIndex].rating = rating;
      product.ratings[existingRatingIndex].comment = comment || "";
      product.ratings[existingRatingIndex].createdAt = new Date();
    } else {
      product.ratings.push({
        user: userId,
        rating: parseInt(rating),
        comment: comment || "",
        createdAt: new Date(),
      });
    }

    await product.save();

    const avgRating =
      product.ratings.length > 0
        ? product.ratings.reduce((sum, r) => sum + r.rating, 0) / product.ratings.length
        : 0;

    res.json({
      message: existingRatingIndex !== -1 ? "Rating updated" : "Rating added",
      ratings: product.ratings,
      averageRating: avgRating.toFixed(1),
      totalRatings: product.ratings.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error submitting rating", error: err.message });
  }
};


