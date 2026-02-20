const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../../middleware/authMiddleware");
const userController = require("../../Controllers/Marketplace/userController");
const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  publishProduct,
  unpublishProduct,
  getPublishedProducts,
  getProductById,
} = require("../../Controllers/Marketplace/Web_productController");

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "uploads", "products");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/products"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { files: 10 } });

// Routes
router.post("/add", upload.array("images", 5), addProduct); // add product with multiple images
router.get("/", getProducts); // get all products
router.put("/update/:id", upload.array("images", 5), updateProduct); // update with multiple images
router.delete("/delete/:id", deleteProduct); // delete product
router.put("/publish/:id", publishProduct); // publish
router.put("/unpublish/:id", unpublishProduct); // unpublish
router.get("/published", getPublishedProducts); // get only published products
router.get("/:id", getProductById);
router.post("/:id/rate", auth, userController.addRating); // get single product by id

module.exports = router;
