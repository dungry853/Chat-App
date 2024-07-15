const express = require("express");
const {
  registerUser,
  checkEmail,
  checkPassword,
  userDetails,
  updateUserDetails,
  searchUser,
} = require("../controller/UserController");
const logout = require("../controller/logout");

const router = express.Router();

//Create user api

//User Details
router.get("/user-details", userDetails);
//CheckPassword and Login
router.post("/password", checkPassword);
//Check Email
router.post("/email", checkEmail);
//Sign up
router.post("/register", registerUser);
//Logout User
router.get("/logout", logout);
//Update User
router.post("/update-user", updateUserDetails);
//Search all user
router.post("/search-user", searchUser);
module.exports = router;
