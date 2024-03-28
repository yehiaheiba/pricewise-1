// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["seller", "buyer", "admin"], // Enum specifying the allowed roles
    default: "buyer", // Optional: set a default role, if applicable
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store", // Assuming you name your store model 'Store'
  },
  // Add other fields as necessary
});

userSchema.methods.isValidPassword = async function (password: string) {
  return await bcrypt.compare(password, this.hashedPassword);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
