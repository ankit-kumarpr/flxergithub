const User = require("../models/userModel");
const Membership = require("../models/membershipModel");
const Referral = require("../models/referralModel");
const sendEmail = require("../utils/sendEmail");
const ejs = require("ejs");
const path = require("path");
const BASE_URL = "https://yourdomain.com";

const buyMembership = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, price, razorpay_payment_id, referralCode } = req.body;

    const now = new Date();
    const end = new Date(now);
    end.setMonth(end.getMonth() + 1); // 1-month validity

    const membership = await Membership.create({
      user: userId,
      type,
      price,
      startDate: now,
      endDate: end,
      invoiceId: razorpay_payment_id,
    });

    let user = await User.findById(userId);
    let referralCodeForUser = user.customID;
    let referralLink;

    if (!referralCodeForUser) {
      referralCodeForUser = generateReferralCode(user.name);
      referralLink = `https://flixer-red.vercel.app/register?ref=${referralCodeForUser}`;

      user = await User.findByIdAndUpdate(
        userId,
        {
          customID: referralCodeForUser,
          referralLink,
        },
        { new: true }
      );
    } else {
      // Even if referral code already exists, still generate referralLink if not present
      if (!user.referralLink) {
        referralLink = `https://flixer-red.vercel.app/register/register?ref=${referralCodeForUser}`;
        user = await User.findByIdAndUpdate(
          userId,
          {
            referralLink,
          },
          { new: true }
        );
      } else {
        referralLink = user.referralLink;
      }
    }

    // Track referral if any
    if (referralCode) {
      const referrer = await User.findOne({ customID: referralCode });
      if (referrer) {
        await Referral.findOneAndUpdate(
          { referrer: referrer._id, referredUser: userId },
          { hasBoughtMembership: true },
          { upsert: true }
        );
      }
    }

    // Send invoice (optional)
    const invoiceHTML = await ejs.renderFile(
      path.join(__dirname, "../utils/templates/invoice.ejs"),
      {
        membership,
        user,
        razorpay_payment_id,
      }
    );

    await sendEmail(user.email, "Your Flexr Membership Invoice", invoiceHTML);

    return res.status(200).json({
      message: "Membership purchased successfully!",
      membership,
      referralCode: referralCodeForUser,
      referralLink: referralLink,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};




// get my refral


const getMyReferrals = async (req, res) => {
  try {
    const referrerId = req.user.id;

    const referrals = await Referral.find({ referrer: referrerId }).populate(
      "referredUser",
      "name email phone membership"
    );

    const onlyRegistered = referrals
      .filter((r) => !r.hasBoughtMembership)
      .map((r) => r.referredUser);

    const boughtMembership = referrals
      .filter((r) => r.hasBoughtMembership)
      .map((r) => r.referredUser);

    res.json({
      totalReferred: referrals.length,
      onlyRegisteredCount: onlyRegistered.length,
      boughtMembershipCount: boughtMembership.length,
      onlyRegistered,
      boughtMembership,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports={
   getMyReferrals, 
   buyMembership
}
