// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const urlRegex =
  /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/;

const StoreSchema = new mongoose.Schema({
  name: String,
  websiteURL: {
    type: String,
    required: true,
    match: [urlRegex, "Please fill a valid URL address"],
  },
  priceTag: String,
  stockTag: String,
  // Other store fields
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Store = mongoose.models.Store || mongoose.model("Store", StoreSchema);

export default Store;
