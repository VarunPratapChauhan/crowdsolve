const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  image: { type: String },
}, { timestamps: true });


module.exports = mongoose.model("Problem", problemSchema);
