const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { buyMembership, getMyReferrals } = require("../controllers/membershipController");
const { createOrder } = require("../controllers/paymentcontroller");

router.post("/buy", auth, buyMembership);
router.get("/referrals", auth, getMyReferrals);

// payment routes
router.post("/order", createOrder);
module.exports = router;
