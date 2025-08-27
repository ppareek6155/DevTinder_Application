const ValidatData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (password.length == 0) {
    throw new Error(" Please enter a password");
  }
};

const validateEditData = (req) => {
  const lis = ["firstName", "lastName", "skills", "emailId", "photoUrl"];
  const isDataValidate = Object.keys(req.body).every((item) =>
    lis.includes(item)
  );
  return isDataValidate;
};

module.exports = { ValidatData, validateEditData };
