const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  phone: String,
  userName: String,
  email: String,
  password: String,
  image: String,
  type: { type: String, lowercase: true },
  registerType: { type: String, lowercase: true },
  address: String,
  DOB: String,
  city: String,
  country: String,
  isActive: Boolean,
  lat: String,
  long: String
}, { timestamps: true });

module.exports = User = mongoose.model("User", UserSchema);
