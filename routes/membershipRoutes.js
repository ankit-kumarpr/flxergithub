const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { buyMembership, getMyReferrals } = require("../controllers/membershipController");

router.post("/buy", auth, buyMembership);
router.get("/referrals", auth, getMyReferrals);

module.exports = router;