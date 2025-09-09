const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your Name"],
  },
  email: {
    type: String,
    required: [true, "Please Enter your Email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please enter a Password"],
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please Confirm your Password"],
    validate: {
      validator: function (val) {
        return val == this.password;
      },
      message: "Password & confirmPassword doesnot Match",
    },
  },
});

// Run this middleware before saving a document to the DB
usersSchema.pre("save", async function (next) {
  // If the password field hasn’t been modified, move on
  if (!this.isModified("password")) return next();

  // Hash the password with cost factor 12 (more cost = stronger hashing)
  this.password = await bcrypt.hash(this.password, 12);

  // Remove confirmPassword field (don’t store it in DB)
  this.confirmPassword = undefined;

  // Call next() to continue saving the document
  next();
});

const User = mongoose.model("User", usersSchema);
module.exports = User;
