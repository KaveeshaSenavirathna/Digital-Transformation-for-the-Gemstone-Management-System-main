const Request = require("../../Models/Marketplace/Request");
const Product = require("../../Models/Marketplace/Product");
const User = require("../../Models/Marketplace/User"); // only declare once
const nodemailer = require("nodemailer");

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Create new request
exports.createRequest = async (req, res) => {
  try {
    const { productId, desiredShape, desiredColor, desiredSize, quantity, intensity, firstName, lastName, email, phone, contactMethod } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const totalPrice = product.price * quantity;

    const request = new Request({
      product: productId,
      desiredShape,
      desiredColor,
      desiredSize,
      quantity,
      intensity,
      firstName,
      lastName,
      email,
      phone,
      contactMethod,
      userId: req.user.id,
      totalPrice
    });

    await request.save();
    res.json({ message: "Request submitted successfully", request });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get all requests (admin)
exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate("product", "type price").sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get logged-in user's requests
exports.getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user.id }).populate("product", "type price").sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Confirm or Reject request (Admin)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { requestId, status, rejectionReason, appointment } = req.body;

    const request = await Request.findById(requestId).populate("product");
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = status;
    if (status === "rejected") request.rejectionReason = rejectionReason || "";
    if (status === "confirmed" && request.contactMethod === "appointment") request.appointment = appointment;

    await request.save();

    // Send email
    let subject, text;
    if (status === "confirmed") {
      subject = "Your request is confirmed!";
      text = `Hello ${request.firstName}, your request for ${request.product.type} is confirmed.`;
      if (request.appointment) text += `\nAppointment: ${new Date(request.appointment).toLocaleString()}`;
    } else if (status === "rejected") {
      subject = "Your request was rejected";
      text = `Hello ${request.firstName}, your request for ${request.product.type} was rejected.\nReason: ${request.rejectionReason}`;
    }

    await transporter.sendMail({ from: process.env.EMAIL_USER, to: request.email, subject, text });

    // Push notification to user
    await User.findByIdAndUpdate(request.userId, {
      $push: {
        notifications: {
          type: status === "confirmed" ? "success" : "error",
          message: text
        }
      }
    });

    res.json({ message: "Request updated, email sent, and notification created", request });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
