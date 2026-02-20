const express = require("express");
const router = express.Router();
const multer = require("multer");
const Certificate = require("../../Models/certification/Certificate");
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");
const { PDFDocument, StandardFonts } = require("pdf-lib");
const QRCode = require("qrcode");

// Upload directory
const uploadDir = "uploads/certificates";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|doc|docx|jpg|jpeg|png|gif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(mime && ext ? null : new Error("Only PDF, DOC, DOCX, and image files are allowed!"));
  },
});

// Generate QR Code for certificate verification
const generateQRCode = async (certificateId) => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-certificate/${certificateId}`;
    const qrCodeDataURL = await QRCode.toDataURL(verificationUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return { qrCodeDataURL, verificationUrl };
  } catch (error) {
    console.error('Error generating QR code:', error);
    return { qrCodeDataURL: null, verificationUrl: null };
  }
};

// --- Get all certificates ---
router.get("/", async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Add certificate ---
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const data = { ...req.body };
    Object.keys(data).forEach((k) => typeof data[k] === "string" && (data[k] = data[k].trim()));

    if (req.file) data.file = req.file.filename;

    const requiredFields = ["certificate_type", "certificate_number", "lab_name", "issue_date"];
    for (const field of requiredFields) {
      if (!data[field]) {
        if (req.file && fs.existsSync(path.join(uploadDir, req.file.filename))) fs.unlinkSync(path.join(uploadDir, req.file.filename));
        return res.status(400).json({ error: `${field.replace("_", " ")} is required` });
      }
    }

    // Remove duplicate check to allow same lab name multiple times
    // const exist = await Certificate.findOne({ certificate_number: data.certificate_number, lab_name: data.lab_name });
    // if (exist) {
    //   if (req.file && fs.existsSync(path.join(uploadDir, req.file.filename))) fs.unlinkSync(path.join(uploadDir, req.file.filename));
    //   return res.status(400).json({ error: "Certificate already exists for this lab." });
    // }

    const cert = new Certificate(data);
    await cert.save();
    
    // Generate QR code for the certificate
    const { qrCodeDataURL, verificationUrl } = await generateQRCode(cert._id);
    if (qrCodeDataURL && verificationUrl) {
      cert.qr_code = qrCodeDataURL;
      cert.verification_url = verificationUrl;
      await cert.save();
    }
    
    res.status(201).json(cert);
  } catch (err) {
    if (req.file && fs.existsSync(path.join(uploadDir, req.file.filename))) fs.unlinkSync(path.join(uploadDir, req.file.filename));
    res.status(400).json({ error: err.message });
  }
});

// --- Update certificate ---
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const data = { ...req.body };
    Object.keys(data).forEach((k) => typeof data[k] === "string" && (data[k] = data[k].trim()));

    if (req.file) {
      const old = await Certificate.findById(req.params.id);
      if (old?.file && fs.existsSync(path.join(uploadDir, old.file))) fs.unlinkSync(path.join(uploadDir, old.file));
      data.file = req.file.filename;
    }

    const cert = await Certificate.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!cert) return res.status(404).json({ error: "Certificate not found" });
    res.json(cert);
  } catch (err) {
    if (req.file && fs.existsSync(path.join(uploadDir, req.file.filename))) fs.unlinkSync(path.join(uploadDir, req.file.filename));
    res.status(400).json({ error: err.message });
  }
});

// --- Delete certificate ---
router.delete("/:id", async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndDelete(req.params.id);
    if (!cert) return res.status(404).json({ error: "Certificate not found" });
    if (cert.file && fs.existsSync(path.join(uploadDir, cert.file))) fs.unlinkSync(path.join(uploadDir, cert.file));
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Download single file ---
router.get("/download/:filename", (req, res) => {
  try {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) return res.download(filePath);
    return res.status(404).send("File not found");
  } catch (err) {
    res.status(500).send("Error downloading file");
  }
});

// --- Download details PDF + uploaded file as ZIP ---
router.get("/download-full/:id", async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ error: "Certificate not found" });

    const zipName = `Certificate_${cert.certificate_number || cert._id}.zip`;
    res.setHeader("Content-Disposition", `attachment; filename="${zipName}"`);
    res.setHeader("Content-Type", "application/zip");

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    // Generate PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([500, 600]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    page.setFont(font);
    page.setFontSize(14);
    page.drawText("Certificate Details", { x: 20, y: 560, size: 18 });
    page.drawText(`Certificate Type: ${cert.certificate_type}`, { x: 20, y: 530 });
    page.drawText(`Certificate Number: ${cert.certificate_number}`, { x: 20, y: 510 });
    page.drawText(`Lab Name: ${cert.lab_name}`, { x: 20, y: 490 });
    page.drawText(`Issue Date: ${cert.issue_date}`, { x: 20, y: 470 });
    page.drawText(`Origin: ${cert.origin || "-"}`, { x: 20, y: 450 });
    page.drawText(`Variety: ${cert.variety || "-"}`, { x: 20, y: 430 });

    const pdfBytes = await pdfDoc.save();
    archive.append(Buffer.from(pdfBytes), { name: "certificate_details.pdf" }); // ✅ FIXED

    // Add uploaded file if exists
    if (cert.file) {
      const filePath = path.join(uploadDir, cert.file);
      if (fs.existsSync(filePath)) archive.file(filePath, { name: cert.file });
    }

    await archive.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// --- Verify certificate by ID ---
router.get("/verify/:id", async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ 
        valid: false, 
        error: "Certificate not found" 
      });
    }
    
    res.json({
      valid: true,
      certificate: {
        id: cert._id,
        certificate_type: cert.certificate_type,
        certificate_number: cert.certificate_number,
        lab_name: cert.lab_name,
        issue_date: cert.issue_date,
        origin: cert.origin,
        variety: cert.variety,
        created_at: cert.createdAt,
        updated_at: cert.updatedAt
      }
    });
  } catch (err) {
    res.status(500).json({ 
      valid: false, 
      error: err.message 
    });
  }
});

// --- Multer error handler ---
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) return res.status(400).json({ error: "File too large" });
  if (err.message.includes("Only PDF")) return res.status(400).json({ error: err.message });
  res.status(500).json({ error: "Upload error" });
});

module.exports = router;
