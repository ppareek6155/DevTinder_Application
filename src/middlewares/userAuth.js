const User = require("../models/user");
const jwt = require("jsonwebtoken");

const UserAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("You need to sign in first");
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById({ _id: decode._id });
    if (!user) {
      throw new Error("User not valid");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("ERROR" + err);
  }
};

module.exports = UserAuth;
