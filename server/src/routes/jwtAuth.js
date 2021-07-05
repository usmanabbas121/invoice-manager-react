const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");
const jwtGenerator = require("../utils/jwtGenerator");
var crypto = require("crypto");
let EmailsRef = require("../emails/emails");

// @desc    Register a user
const registerUser = async (req, res, next) => {
  const {
    name,
    email,
    password,
    role,
    created_by,
    status,
  } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const user = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json({ error: "User already exist!" });
    }

    var bcryptPassword = "";

    if (password.length > 1) {
      const salt = await bcrypt.genSalt(10);
      bcryptPassword = await bcrypt.hash(password, salt);
    }

    let newUser = await client.query(
      `INSERT INTO users 
        (name, email, password_hash, role, created_at, created_by, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        name,
        email,
        bcryptPassword,
        role,
        new Date().toISOString(),
        created_by,
        status,
      ]
    );

    await client.query("COMMIT");

    next();

    return res.json({ user: "Success" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @desc    Update a user
const updateUser = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    created_by,
    status,
    user_id,
  } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const user = await client.query(
      "SELECT * FROM users WHERE email = $1 AND user_id!=$2 ",
      [email, user_id]
    );

    if (user.rows.length > 0) {
      return res.status(401).json({ error: "User is existing already!" });
    }

    // if (user.rows.length == 0) {
    //   return res.status(401).json({ error: "User is not existing!" });
    // }

    if (password.length > 0) {
      const salt = await bcrypt.genSalt(10);
      const bcryptPassword = await bcrypt.hash(password, salt);

      let newUser = await client.query(
        "UPDATE users SET name=$1, email=$2, password_hash=$3, role=$4, status=$5, updated_by=$6, updated_at=$7 WHERE user_id=$8",
        [
          name,
          email,
          bcryptPassword,
          role,
          status,
          created_by,
          new Date().toISOString(),
          user_id,
        ]
      );
    } else {
      let newUser = await client.query(
        "UPDATE users SET name=$1, email=$2, role=$3, status=$4, updated_by=$5, updated_at=$6 WHERE user_id=$7",
        [
          name,
          email,
          role,
          status,
          created_by,
          new Date().toISOString(),
          user_id,
        ]
      );
    }

    const userData = await client.query(
      "SELECT * FROM users WHERE status !='DELETED'"
    );

    // const jwtToken = jwtGenerator(user.rows[0].user_id);
    await client.query("COMMIT");
    return res.json({ user: "Success", usersdata: userData.rows });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err.message);
    if (err.code == "23505") {
      res.status(500).send("Duplicate email entry");
    } else {
      res.status(500).send("Server error");
    }
  }
};



// @desc    login authentication
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND status !=$2",
      [email, "DELETED"]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Invalid Credential" });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password_hash
    );

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid Credential" });
    }
    const jwtToken = jwtGenerator(user.rows[0].user_id);

    const userData = await pool.query(
      "SELECT * FROM users WHERE status !='DELETED'"
    );

    return res.json({
      jwtToken,
      userData: userData.rows,
      user: {
        user_id: user.rows[0].user_id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role,
        status: user.rows[0].status,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Server error" });
  }
};

// @desc    Reset a Password
const resetPassword = async (req, res) => {
  const { email } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const user = await client.query(
      "SELECT * FROM users WHERE email = $1 AND status !=$2",
      [email, "DELETED"]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Email is not existing." });
    }

    const token = crypto.randomBytes(32).toString("hex"); //creating the token to be sent to the forgot password form (react)
    // const expires_at = Date.now() + 3600000; //1 hour
    const user_id = user.rows[0].user_id;

    const deleteToken = await client.query(
      "DELETE FROM forgot_password WHERE user_id = $1",
      [user_id]
    );

    let newUser = await client.query(
      "INSERT INTO forgot_password (user_id, token) VALUES ($1, $2) RETURNING *",
      [user_id, token]
    );

    await client.query("COMMIT");
    return res.json({ success: "reset password success", newUser });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err.message);
    res.status(500).send({ error: "Server error" });
  }
};

// @desc    Delete a user
const deleteUser = async (req, res) => {
  const id = req.params.id;
  const loggeduserid = req.params.loggeduserid;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const newUser = await client.query(
      "UPDATE users SET deleted_at = $1, deleted_by=$2, status=$3 WHERE user_id = $4",
      [new Date().toISOString(), loggeduserid, "DELETED", id]
    );

    await client.query("COMMIT");
    return res
      .status(401)
      .json({ id: id, loggeduserid: loggeduserid, error: "delete this user" });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).send({ error: "Server error" });
  }
};

// @desc    Update password
const updatePassword = async (req, res) => {
  const id = req.params.id;
  const { password } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const user = await client.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "User is not existing." });
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    const newUser = await client.query(
      "UPDATE users SET password_hash = $1 WHERE user_id = $2",
      [bcryptPassword, id]
    );

    const deleteToken = await client.query(
      "DELETE FROM forgot_password WHERE user_id = $1",
      [id]
    );
    await client.query("COMMIT");
    return res.json({ success: "reset password success", newUser });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err.message);
    res.status(500).send({ error: "Server error" });
  }
};

// @desc    List of users
const listOfUsers = async (req, res) => {
  try {
    const user = await pool.query(
      // "SELECT * FROM users WHERE status !='DELETED' ORDER BY created_at DESC"
      "SELECT * FROM users ORDER BY created_at DESC"
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "No user is not existing." });
    }

    return res.json({ users: user.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Server error" });
  }
};

// @desc    Verify Password Link
const verifyPasswordLink = (req, res) => {
  const { id, token } = req.body;
  try {
    res.status(200).send({ id, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @desc    Verify User session
const verifyUserSession = (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @desc    Get single user
const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE status !=$1 AND user_id=$2",
      ["DELETED", id]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "No user is not existing." });
    }

    return res.json({ users: user.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Server error" });
  }
};

module.exports = {
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
};
