const express = require("express");
const userRouter = express.Router();
const UserAuth = require("../middlewares/userAuth.js");
const Connections = require("../models/connection.js");
const user = require("../models/user.js");

userRouter.get("/connections", UserAuth, async (req, res) => {
  const USER_SAFE_DATA = "firstName lastName skills photoUrl";
  try {
    const loggedInUser = req.user;

    const connectionRequest = await Connections.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.send(data);
  } catch (err) {
    console.log("err1" + err);
    res.status(400).send("Error : " + err.message);
  }
});
userRouter.get("/request/recevied", UserAuth, async (req, res) => {
  const USER_SAFE_DATA = "firstName lastName skills photoUrl";
  try {
    const loggedInUser = req.user;
    const connectionRequest = await Connections.find({
      toUserId: loggedInUser._id,
      status: "interested",
    })
      .select("fromUserId")
      .populate("fromUserId", USER_SAFE_DATA);

    res.json(connectionRequest);
  } catch (err) {
    console.log("err1" + err);
    res.status(400).send("Error : " + err.message);
  }
});

userRouter.get("/user/feed", UserAuth, async (req, res) => {
  const USER_SAFE_DATA = "firstName lastName skills photoUrl";
  const Skip = req.query.page || 0;
  const Limit = req.query.limit || 10;

  try {
    const loggedInUser = req.user;
    const connectionRequest = await Connections.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("toUserId fromUserId");
    const hideConnectedUser = new Set();
    connectionRequest.forEach((element) => {
      hideConnectedUser.add(element.fromUserId);
      hideConnectedUser.add(element.toUserId);
    });

    const data1 = await user
      .find({
        $and: [
          { _id: { $nin: Array.from(hideConnectedUser) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
      .select(USER_SAFE_DATA)
      .skip(Skip)
      .limit(Limit);
    res.json(data1);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = userRouter;
