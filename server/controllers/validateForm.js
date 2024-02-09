const Yup = require("yup");

const ValidateForm = (req, res, next) => {
  const formSchema = Yup.object({
    username: Yup.string()
      .required("Username required")
      .min(6, "UserName too short")
      .max(25, "UserName too Log!"),

    password: Yup.string()
      .required("Password required")
      .min(6, "Password too short")
      .max(25, "password too Log!"),
  });
  const formData = req.body;
  formSchema
    .validate(formData)
    .catch((err) => {
      res.status(422).json({ msg: "Invalid Data" });
    })
    .then((valid) => {
      if (valid) {
        next();
      } else {
        res.status(422).send();
      }
    });
};
module.exports = ValidateForm;
