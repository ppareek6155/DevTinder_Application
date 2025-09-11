const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.DB_SECRET_KEY);
};

module.exports = connectDB;
