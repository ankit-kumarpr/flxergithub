const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const multer = require("multer");
const {
  RegisterUser,
  login,
  getProfile,
  updateProfile
} = require("../controllers/authController");

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

router.post("/register", RegisterUser);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.put("/updateprofile", auth, upload.single("profileImage"), updateProfile);

module.exports = router;
