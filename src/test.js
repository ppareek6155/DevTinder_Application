const express = require("express");
const app = express();

//This is a middleware handler
// app.use((req, res, next) => {
//   console.log("new request recieved");
//   next();
// });

// //This is a route handler
// app.get("/home", (req, res) => {
//   res.send("Hello Page");
// });

// //This is a router which also has a route handler
// const userRouter = express.Router();
// userRouter.get("/profile", (req, res, next) => {
//   res.send("User profile");
// });

// app.use("/users", userRouter);

// app.listen(3000, () => {
//   console.log("Example app listening on port 3000!");
// });

app.get("/user", (req, res) => {
  res.send("hello 2");
});
app.use("/", (err, req, res, next) => {
  //   if (err) {
  //     console.log("router handler 1");
  //     res.send(err);
  //   } else {
  //     res.send("err");
  //   }
  res.send("asdfasd");
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
