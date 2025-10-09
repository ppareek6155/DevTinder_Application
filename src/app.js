const express = require("express");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
const { authRouter } = require("./routes/auth.js");
const { profileRouter } = require("./routes/profile.js");
const { requestRouter } = require("./routes/request.js");
const userRouter = require("./routes/user.js");
require("./utilis/cronJob.js");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173/",
    credentials: true,
  })
);
app.use("/", userRouter);
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("connected to the database");
    // create the server in the specific port number
    app.listen(process.env.PORT_NUMBER, () => {
      console.log("server is runnig on the port number 8888");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
