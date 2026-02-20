const nodemailer = require("nodemailer");

// Prefer explicit Gmail SMTP settings for reliability
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendResetEmail(to, token) {
  const frontend = process.env.FRONTEND_URL || "http://localhost:3000";
  const resetURL = `${frontend}/reset-password/${token}`;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER/EMAIL_PASS not configured on server");
  }

  try {
    await transporter.sendMail({
      from: `"DGM System" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetURL}">here</a> to reset your password.</p>`,
    });
  } catch (err) {
    // Surface nodemailer error to caller
    throw new Error(err?.message || "Email send failed");
  }
}

module.exports = { sendResetEmail };
