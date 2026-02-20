const express = require("express");
const router = express.Router();
const userController = require("../../Controllers/Marketplace/userController");
const auth = require("../../middleware/authMiddleware");
const User = require("../../Models/Marketplace/User");


// Profile routes (protected with JWT)
router.get("/me", auth, userController.getUserById);
router.put("/me", auth, userController.updateUser);
router.delete("/me", auth, userController.deleteUser);

// Notifications route
router.get("/notifications", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.notifications.reverse()); // latest first
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
