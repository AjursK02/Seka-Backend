const mongoose = require("mongoose");

const waitlistEntrySchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const WaitlistEntry = mongoose.model("WaitlistEntry", waitlistEntrySchema);

module.exports = WaitlistEntry;
