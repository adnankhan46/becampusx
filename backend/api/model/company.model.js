// api/model/company.model.js
import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    default: null,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  isAuthenticated: {
    type: Boolean,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    default: null,
  },
}, { timestamps: true });

const Company = mongoose.model("Company", companySchema);

export default Company;