const mongoose=require('mongoose');

const referralSchema = new mongoose.Schema({
  referrer: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: "User"
     },
  referredUser: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: "User" 
    },
  hasBoughtMembership: { 
    type: Boolean,
     default: false
     },
});
module.exports = mongoose.model("Referral", referralSchema);