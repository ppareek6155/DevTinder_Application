const cron = require("node-cron");
const { startOfDay, endOfDay, subDays } = require("date-fns");
const Connections = require("../models/connection.js");
const sendEmail = require("./sendEmail.js");

// This job will run at 9 AM in the morning everyday
cron.schedule("0 9 * * *", async () => {
  // Send emails to all people who got the request previous day
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await Connections.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const ListofEmails = pendingRequests.map((d) => d.toUserId.emailId);

    for (const email of ListofEmails) {
      // Send emails
      try {
        sendEmail.run(
          "New friend requests pending for " + email,
          "There are so many friend requests pending, please login to Devtinder and accept the request."
        );
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
});
