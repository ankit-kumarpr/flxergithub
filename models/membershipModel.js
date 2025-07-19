const mongoose = require("mongoose");
const membershipSchema = new mongoose.Schema({
  user: {
     type: mongoose.Schema.Types.ObjectId,
      ref: "User"
     },
  type: {
     type: String,
      enum: ["silver", "gold", "diamond"],
       required: true
     },
  price: {
    type:Number,
},
  startDate: {
    type:Date
  },
  endDate: {
    type:Date
},
  invoiceId: {
    type:String
},
});

module.exports = mongoose.model("Membership", membershipSchema);