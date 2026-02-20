const express = require("express");
const router = express.Router();
const { createRequest, getRequests, getUserRequests, updateRequestStatus } = require("../../Controllers/Marketplace/requestController");
const auth = require("../../middleware/authMiddleware");

// Create request
router.post("/create", auth, createRequest);

// Admin: Get all requests
router.get("/", auth, getRequests);

// User: Get own requests
router.get("/my-requests", auth, getUserRequests);

// Admin: Confirm / Reject request
router.put("/update-status", auth, updateRequestStatus);

module.exports = router;
