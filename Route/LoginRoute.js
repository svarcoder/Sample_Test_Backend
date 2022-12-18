/** @format */

const express = require("express");
const {
	addUser,
	allUserView,
	userUpdate,
	userDelete,
} = require("../Controller/Login/LoginController");
const { myValidations } = require("../Validator/Validator");

const router = express.Router();

router.post("/user-resister", myValidations, addUser);
router.get("/user-get", allUserView);
router.put("/user-update/:id", myValidations, userUpdate);
router.delete("/user-delete/:id", userDelete);

module.exports = router;
