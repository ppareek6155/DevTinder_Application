const express = require("express");
const authRouter = express.Router();
const { ValidatData } = require("../utilis/validation.js");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
// const getJWT = require("../models/user.js");

// always write the things in try-catch
authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password, photoUrl } = req.body;
  try {
    ValidatData(req);
    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hash,
      photoUrl,
    });
    const token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    const saveUser = await user.save();
    res.send(saveUser);
  } catch (err) {
    res.send("Sign Up failed" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });

    if (user) {
      const pswd = bcrypt.compare(password, user.password);

      if (!pswd) {
        throw new Error("invalid credentials");
      }
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
    } else {
      throw new Error("invalid credentials");
    }

    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logout sucessfully!!");
});

module.exports = { authRouter };
