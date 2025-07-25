const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const welcomeTemplate = require("../utils/templates/welcomeTemplate");
const Membership = require("../models/membershipModel");
const Referral = require("../models/referralModel");


const generateCustomID = (username) => {
  const random = Math.floor(100 + Math.random() * 90000);
  return "flexr" + username.toLowerCase().replace(/\s+/g, "") + random;
};

// Register
// const RegisterUser = async (req, res) => {
//   try {
//     const { name, email, phone, password, role } = req.body;

//     const existing = await User.findOne({ email });

//     if (existing)
//         {
        
//         return res.status(400).json({
//             error:true,
//          message: "User already exists"
//          });
//         }

//     const hashed = await bcrypt.hash(password, 10);
//     const customID = generateCustomID(name);

//     const newUser = await User.create({
//       name,
//       email,
//       phone,
//       password: hashed,
//       role,
//       customID
//     });

//     const html = welcomeTemplate(name, customID, email, password);
//     await sendEmail(email, "Welcome to Flexr!", html);

//    return res.status(201).json({
//         error:false,
//          message: "Registered Successfully",
//           newUser 
//         });
//   } catch (err) {
//    return res.status(500).json({ message: err.message });
//   }
// };


const RegisterUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const ref = req.query.ref; // Grab ?ref=customID from query

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        error: true,
        message: "User already exists"
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const customID = generateCustomID(name);

    // Build user object
    const userData = {
      name,
      email,
      phone,
      password: hashed,
      role,
      customID,
    };

    // If user came from a referral link, attach referral info
    if (ref) {
      const referrerUser = await User.findOne({ customID: ref });
      if (referrerUser) {
        userData.referralLink = ref; // Store referrer’s customID in the user document
      }
    }

    // Create user
    const newUser = await User.create(userData);

    // If referral exists, log it in the Referral collection
    if (ref) {
      const referrerUser = await User.findOne({ customID: ref });
      if (referrerUser) {
        await Referral.create({
          referrer: referrerUser._id,
          referredUser: newUser._id,
        });
      }
    }

    // Send welcome email
    const html = welcomeTemplate(name, customID, email, password);
    await sendEmail(email, "Welcome to Flexr!", html);

    return res.status(201).json({
      error: false,
      message: "Registered Successfully",
      newUser,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({
        error:true,
         message: "User not found"
         });
        }

    const match = await bcrypt.compare(password, user.password);
    if (!match){
         return res.status(401).json({
         message: "Invalid credentials"
         });
        }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

   return res.status(200).json({ 
        message: "Login successful",
         token,
         user,
          });
  } catch (err) {
    return res.status(500).json({ 
        error:true,
        message: err.message 
    });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user data without password
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    // Fetch latest membership for the user (if any)
    const membership = await Membership.findOne({ user: userId })
      .sort({ startDate: -1 });

    return res.status(200).json({
      error: false,
      message: "Profile fetched successfully",
      user,
      referralLink: user.referralLink,
      membership: membership || null, // null if no membership
    });
  } catch (err) {
    console.error("Get Profile Error:", err);
    return res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};


// Update Profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;
    let updateData = { name, phone };

    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    const updated = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
    return res.status(200).json({
         message: "Profile updated", 
        user: updated
     });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports={
     RegisterUser,
  login,
  getProfile,
  updateProfile
}
