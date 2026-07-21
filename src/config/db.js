const mongoose = require("mongoose");

let cachedConnection = null;
let cachedPromise = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is required");
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose.connect(mongoUri).then((connection) => connection);
  }

  cachedConnection = await cachedPromise;

  return cachedConnection;
};

module.exports = connectDB;
