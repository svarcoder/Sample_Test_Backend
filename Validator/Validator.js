const { body } = require("express-validator");

exports.myValidations = [
	body("fName", "Please Provide First Name").isString(),
	body("lName", "Please Provide Last Name").isString(),
	body("email", "Please Provide Right Email").isEmail(),
	body("password", "Please Provide Password Between 5 to 8 Char").isLength({
		min: 5,
		max: 8,
	}),
];
