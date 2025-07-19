const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const welcomeTemplate = require("../utils/templates/welcomeTemplate");

const generateCustomID = (username) => {
  const random = Math.floor(100 + Math.random() * 90000);
  return "flexr" + username.toLowerCase().replace(/\s+/g, "") + random;
};

// Register
const RegisterUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const existing = await User.findOne({ email });

    if (existing)
        {
        
        return res.status(400).json({
            error:true,
         message: "User already exists"
         });
        }

    const hashed = await bcrypt.hash(password, 10);
    const customID = generateCustomID(name);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashed,
      role,
      customID
    });

    const html = welcomeTemplate(name, customID, email, password);
    await sendEmail(email, "Welcome to Flexr!", html);

   return res.status(201).json({
        error:false,
         message: "Registered Successfully",
          newUser 
        });
  } catch (err) {
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
    const user = await User.findById(req.user.id).select("-password");

   return res.status(200).json({
    error:false,
    message:"Profile data",
    user,
     referralLink: user.referralLink,
     });
  } catch (err) {
  return  res.status(500).json({ 
    error:true,
    message: err.message
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