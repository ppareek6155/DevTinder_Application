const mongoose = require("mongoose");
const validator = require("validator");
const { default: isEmail } = require("validator/lib/isEmail");
const { default: isURL } = require("validator/lib/isURL");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: String,
    emailId: {
      type: String,
      required: true,
      trim: true,
      lowecase: true,
      validate(value) {
        if (!isEmail(value)) {
          throw new Error("invalid email id");
        }
      },
    },

    password: String,
    age: String,
    about: String,
    skills: [String],
    photoUrl: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
      validate(value) {
        if (!isURL(value)) {
          throw new Error("not a valid photoUrl");
        }
      },
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw "invalid gender";
        }
      },
    },
    createdDate: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "DevTinder@123", {
    expiresIn: "7d",
  });
  return token;
};

// userSchema.methods.validatePass = async function (passowrdByUser) {
//   const user1 = this;
//   const isPasswordValid = await bcrypt.compare(passowrdByUser, user1.password);
//   return isPasswordValid;
// };
// After creating the schema we need to create a model for it. Always give the Capital name of the variable
// that stores the model

module.exports = mongoose.model("user", userSchema);
