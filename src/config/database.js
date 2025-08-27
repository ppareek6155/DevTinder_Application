const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://pareek6155:oFwxWwUGiBtpGSTz@nodeproject.r3wqi.mongodb.net/DevTinderDB"
  );
};

module.exports = connectDB;
