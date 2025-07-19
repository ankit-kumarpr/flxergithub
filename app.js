const express = require("express");
const cors = require("cors");
const connectToDb = require("./DB/db");
const authRoutes = require("./routes/authRoutes");
const membershipRoutes = require("./routes/membershipRoutes");
const path = require("path");

const app = express();


connectToDb(); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/flexr/auth',authRoutes);
app.use("/flexr/membership", membershipRoutes);

module.exports = app;
