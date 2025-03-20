const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("config");
const _ = require("lodash");
const Joi = require("joi");
const { User, validates, validateUser } = require("../models/user");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");
const { valid } = require("joi");
const { ObjectId } = require("mongodb");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");
  user = new User({
    name: req.body.name,
    phoneno:req.body.phoneno,
    email: req.body.email,
    username: req.body.username,
    password: await bcrypt.hash(req.body.password, 10),
    gender: req.body.gender,
  });
  try {
    await user.save();
    const token = jwt.sign(
      { _id: user._id, isAdmin: user.isAdmin },
      process.env.jwtPrivateKey
    );
    res
      .header("token", token)
      .header("access-control-expose-headers", "token")
      .send(_.pick(user, ["_id", "name","phoneno", "email","gender"]));
  } catch (err) {
    console.log("error: ", err);
  }
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.send("this user does'nt exists in the database!");
  res.send(user);
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.send("this user does'nt exists in the database!");
  res.send(user);
});
router.delete("/:id", auth, async (req, res) => {
  console.log("Delete request for ID:", req.params.id);
  try {
    const user = await User.findByIdAndDelete(new ObjectId(req.params.id));
    if (!user) {
      console.log("User not found in database:", req.params.id);
      return res.status(404).send("User not found.");
    }
    res.send({ message: "User deleted successfully." });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Internal Server Error.");
  }
});

router.post("/login", async (req, res) => {
  const { error } = validates(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.user) return res.send("User already logged in!");
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validpassword = await bcrypt.compare(req.body.password, user.password);
  if (!validpassword) return res.status(400).send("invalid email or password");

  const token = jwt.sign(
    { _id: user._id, isAdmin: user.isAdmin },
    process.env.jwtPrivateKey
  );
  res.header("token").send(token);
});

router.post("/logout", async (req, res) => {});
module.exports = router;
