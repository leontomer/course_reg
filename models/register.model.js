const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const registerSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  approved: { type: Boolean, default: false },
});

module.exports = register = mongoose.model("registerSchema", registerSchema);
