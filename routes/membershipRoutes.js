const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { buyMembership, getMyReferrals } = require("../controllers/membershipController");
const paymentcontrol = require("../controllers/paymentcontroller");

router.post("/buy", auth, buyMembership);
router.get("/referrals", auth, getMyReferrals);

// payment routes
router.post("/orders", paymentcontrol.orders);
router.post("/verify", paymentcontrol.verify);

module.exports = router;
