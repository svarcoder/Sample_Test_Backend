/** @format */

const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema(
	{
		fName: {
			type: String,
			default: "",
			required: true,
		},
		lName: {
			type: String,
			default: "",
			required: true,
		},
		email: {
			type: String,
			default: "",
			required: true,
		},
		password: {
			type: String,
			default: "",
			requird: true,
		},
		resetToken: String,
		expireToken: Date,
	},
	{ timestamps: true }
);

module.exports = mongoose.model("login", loginSchema);
