const express = require("express");
const profileRouter = express.Router();
const UserAuth = require("../middlewares/userAuth.js");
const { validateEditData } = require("../utilis/validation.js");

profileRouter.get("/profile/view", UserAuth, async (req, res) => {
  try {
    const { firstName, lastName, emailId, photoUrl } = req.user;
    res.send({ firstName, lastName, emailId, photoUrl });
  } catch (err) {
    res.status(400).send("ERROR:" + err);
  }
});

profileRouter.put("/profile/edit", UserAuth, async (req, res) => {
  const isDataValidate = validateEditData(req);
  const user = req.user;
  try {
    if (!isDataValidate) {
      throw new Error("Cannot update the data");
    }

    Object.keys(req.body).forEach((item) => (user[item] = req.body[item]));
    user.save();
    res.json(user);
  } catch (err) {
    res.send("Error" + err.message);
  }
});

module.exports = { profileRouter };
