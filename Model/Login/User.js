/** @format */

const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
	{
		address: {
			type: String,
			default: "",
			requird: true,
		},
		phone: {
			type: String,
			default: "",
			requird: true,
		},
		bio: {
			type: String,
			default: "",
			requird: true,
		},
		post: {
			type: String,
			default: "",
			requird: true,
		},
		customerId: {
			type: ObjectId,
			ref: "logins",
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
