const express = require("express");
const connectDB = require("../config/db");
const WaitlistEntry = require("../models/WaitlistEntry");

const router = express.Router();

const isValidEmail = (email) =>
  /^(?![.])[A-Z0-9._%+-]+@[A-Z0-9-]+(?:\.[A-Z0-9-]+)+$/i.test(email);

router.post("/", async (req, res, next) => {
  try {
    await connectDB();

    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    const existingEntry = await WaitlistEntry.findOne({ email });

    if (existingEntry) {
      return res.status(409).json({
        success: false,
        message: "You are already on the waitlist.",
      });
    }

    await WaitlistEntry.create({ email });

    return res.status(201).json({
      success: true,
      message: "You have been added to the waitlist",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You are already on the waitlist.",
      });
    }

    return next(error);
  }
});

module.exports = router;
