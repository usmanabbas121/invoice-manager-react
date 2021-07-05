const express = require("express");
const router = express.Router();

const authorize = require("../middleware/authorize");

let validate = require("../middleware/connection");
const { UserRegisterationSchema } = require("../middleware/jwtAuthValidate");

const {
  registerUser,
  updateUser,
  loginUser,
  resetPassword,
  deleteUser,
  updatePassword,
  listOfUsers,
  verifyPasswordLink,
  verifyUserSession,
  getUser,
} = require("./jwtAuth");

// @route   POST /authentication/regiser
// @desc    Register a user
router.post(
  "/register",
  validate({ body: UserRegisterationSchema }),
  registerUser
);

// @route   POST /authentication/update
// @desc    Update a user
router.post("/update", updateUser);

// @route   POST /authentication/login
// @desc    Login a user
router.post("/login", loginUser);

// @route   POST /authentication/reset-password
// @desc    Reset a Password
router.post("/reset-password", resetPassword);

// @route   DELETE /authentication/delete/:id/:loggeduserid
// @desc    Delete a user
router.delete("/delete/:id/:loggeduserid", deleteUser);

// @route   POST /authentication/reset-password/:id
// @desc    Update password
router.post("/reset-password/:id", updatePassword);

// @route   GET /authentication/users
// @desc    Get List of all users
router.get("/users", listOfUsers);

// @route   POST /authentication/verify-password-link"
// @desc    Verify Password Link
router.post("/verify-password-link", verifyPasswordLink);

// @route   POST /authentication/verify"
// @desc    Verify User session
router.post("/verify", authorize, verifyUserSession);

// @route   GET /authentication/users/:id"
// @desc    Get single user
router.get("/users/:id", getUser);

module.exports = router;
