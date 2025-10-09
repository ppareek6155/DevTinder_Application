const cron = require("node-cron");
const { startOfDay, endOfDay, subDays } = require("date-fns");
const Connections = require("../models/connection.js");
const sendEmail = require("./sendEmail.js");
const { Queue, Worker } = require("bullmq");
const redisConnection = require("./redisConnection.js");
const logger = require("../utilis/winstonConfig.js");

//Create the Queue
const queue = new Queue("emailQueue", { connection: redisConnection });
const worker = new Worker(
  "emailQueue",
  async (job) => {
    try {
      await sendEmail.run(
        "New Friend Request is pending for " + job.data.email,
        "There are so many friend request , Please login to Devtinder.in and accept or reject the reqest"
      );
    } catch (err) {
      logger.error("Error while sending the email " + err.message);
    }
  },
  { connection: redisConnection, attempts: 2 }
);

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

    const ListofEmails = [
      ...new Set(pendingRequests.map((d) => d.toUserId.emailId)),
    ];

    for (const email of ListofEmails) {
      await queue.add("sendEmail", { email });
    }
  } catch (err) {
    logger.error("Error occured while runing the job for email");
  }
});

worker.on("completed", (job) => {
  logger.info(`job ${job.id} completed`);
});
worker.on("failed", (job) => {
  logger.error(`Job ${job.id} failed`);
});

process.on("SIGINT", async () => {
  await worker.close();
  await queue.close();
  process.exit();
});
