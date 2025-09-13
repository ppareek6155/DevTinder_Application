const express = require("express");
const requestRouter = express.Router();
const UserAuth = require("../middlewares/userAuth.js");
const Connection = require("../models/connection.js");
const User = require("../models/user.js");
const sendEmail = require("../utilis/sendEmail.js");

requestRouter.post(
  "/request/send/:status/:toId",
  UserAuth,
  async (req, res) => {
    const user = req.user;
    try {
      const fromUserId = user._id;
      const toUserId = req.params.toId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"].includes(status);
      const isToIdValid = await User.findById(toUserId).exec();

      if (!allowedStatus) {
        throw new Error("Invalid status");
      }
      if (!isToIdValid) {
        return res.status(404).json({ message: "User not found" });
      }
      const existingConnectionReq = await Connection.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionReq) {
        return res
          .status(400)
          .json({ message: "Connection request already Exists" });
      }
      const requestConnection = new Connection({
        fromUserId,
        toUserId,
        status,
      });
      requestConnection.save();
      const emailRes = await sendEmail.run();

      res.send("data saved");
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  UserAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const validStatus = ["accepted", "rejected"];
      if (!validStatus.includes(status)) {
        return res.status(400).json({ message: " Status not allowed" });
      }
      const connectionRequest = await Connection.findOne({
        status: "interested",
        toUserId: loggedInUser._id,
        _id: requestId,
      });

      if (!connectionRequest) {
        return res.status(404).json({ message: "Connection not found!!" });
      }

      connectionRequest.status = status;
      const acceptRequest = await connectionRequest.save();
      res.json({ message: "Request accepted", data: acceptRequest });
    } catch (err) {
      res.status(400).send("Error " + err.message);
    }
  }
);

module.exports = { requestRouter };
