const mongoose = require("mongoose");

let cachedConnection = null;

const connectDB = async () => {
  const mongoUri =
    process.env.MongoDB_MONGODB_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      "MongoDB_MONGODB_URI or MONGODB_URI is required"
    );
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  cachedConnection = mongoose.connect(mongoUri);
  await cachedConnection;
  console.log("MongoDB connected");

  return mongoose.connection;
};

module.exports = connectDB;
