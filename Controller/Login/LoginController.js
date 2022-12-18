/** @format */

const express = require("express");
const login = require("../../Model/Login/LoginModel");
const user = require("../../Model/Login/User");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const { ObjectID } = require("mongodb");
const CryptoJS = require("crypto-js");

let objectId = mongoose.Types.ObjectId;

exports.allUserView = async (req, res) => {
	await login
		.aggregate([
			{
				$lookup: {
					from: "users",
					let: { userId: "$_id" },
					pipeline: [
						{
							$match: {
								$expr: { $and: [{ $eq: ["$customerId", "$$userId"] }] },
							},
						},
					],
					as: "userDetails",
				},
			},
			{ $unwind: "$userDetails" },
		])
		.then((result) => {
			// const bytes = CryptoJS.AES.decrypt(result[0]?.password, "123456");
			// const originalText = bytes.toString(CryptoJS.enc.Utf8);
			return res.status(200).json({
				success: true,
				messege: "Done",
				data: result,
				// oPassword: originalText,
			});
		})
		.catch((err) => {
			console.log("Error in Get User", err);
			return res.status(400).json({
				success: false,
				messege: "Error in Get User",
			});
		});
};

exports.addUser = async (req, res) => {
	const { fName, lName, email, address, phone, bio, post } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			success: false,
			messege: errors.array(),
		});
	}

	const password1 = req.body.password;

	const hashPassword = await CryptoJS.AES.encrypt(
		password1,
		"123456"
	).toString();

	let newLogin = new login({
		fName,
		lName,
		email,
		password: hashPassword,
	});

	await newLogin
		.save()
		.then(async (result) => {
			const customerId = result._id;

			let newUserDetails = new user({
				address,
				phone,
				bio,
				post,
				customerId: customerId,
			});
			await Promise.all([newUserDetails.save()])
				.then((data) => {
					return res.status(201).json({
						success: true,
						messege: "Done",
						data: data,
					});
				})
				.catch((err) => {
					console.log("Error in User Save", err);
					return res.status(400).json({
						success: false,
						messege: "Error in User Save",
					});
				});
		})
		.catch((err) => {
			console.log("Error in Login Save", err);
			return res.status(400).json({
				success: false,
				messege: "Error in Login Save",
			});
		});
};

exports.userUpdate = async (req, res) => {
	const { fName, lName, email, address, phone, bio, post } = req.body;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			success: false,
			messege: errors.array(),
		});
	}

	let Id = req.params.id;

	let loginId = objectId(Id);

	const password1 = req.body.password;

	const hashPassword = await CryptoJS.AES.encrypt(
		password1,
		"123456"
	).toString();

	let loginData = {
		fName,
		lName,
		email,
		password: hashPassword,
	};
	let userData = {
		address,
		phone,
		bio,
		post,
	};

	await Promise.all([
		login.findByIdAndUpdate({ _id: loginId }, loginData),
		user.findOneAndUpdate({ customerId: loginId }, userData),
	])
		.then((data) => {
			return res.status(201).json({
				success: true,
				messege: "Done",
				data: data,
			});
		})
		.catch((err) => {
			console.log("error", err);
			return res.status(400).json({
				success: false,
				messege: "Error in Update.",
			});
		});
};

exports.userDelete = async (req, res) => {
	let Id = req.params.id;

	let logInId = objectId(Id);

	await Promise.all([
		login.findByIdAndDelete({ _id: logInId }),
		user.findOneAndDelete({ customerId: logInId }),
	])
		.then(async (admin) => {
			return res.status(201).json({
				success: true,
				messege: "Done",
			});
		})
		.catch((err) => {
			console.log("error", err);
			return res.status(400).json({
				success: false,
				messege: "Error in User Delete",
			});
		});
};
