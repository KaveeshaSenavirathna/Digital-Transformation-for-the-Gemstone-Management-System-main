const User = require("../../Models/Marketplace/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendResetEmail } = require("../../utils/emailService");

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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      userId: user._id,   // send this back
      name: user.name,    // optional, for frontend use
      email: user.email,  // optional
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const secret = process.env.JWT_SECRET || "your-secret-key";
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "15m" });
    await sendResetEmail(user.email, token);

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send reset email", error: err?.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const secret = process.env.JWT_SECRET || "your-secret-key";
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = password;
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
