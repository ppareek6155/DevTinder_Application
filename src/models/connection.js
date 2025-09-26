const mongoose = require("mongoose");
const user = require("../models/user.js");

const requestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    status: {
      type: String,
      required: true,
      enum: ["ignored", "interested", "accepted", "rejected"],
    },
    createdDate: Date,
  },
  {
    timestamps: true,
  }
);

requestSchema.index({ fromUserId: 1, toUserId: 1 });

requestSchema.pre("save", function (next) {
  const connectionRequest = this;

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to youself!!");
  }
  next();
});
module.exports = mongoose.model("Connection", requestSchema);
