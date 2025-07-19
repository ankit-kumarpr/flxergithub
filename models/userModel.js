const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "affiliate", "user", "brandowner"],
      default: "user",
    },
    customID: {
  type: String,
  unique: true,
},
referralLink: {
  type: String,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
