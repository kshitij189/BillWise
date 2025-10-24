import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();
const SECRET = process.env.SECRET;
const HOST = process.env.SMTP_HOST;
const PORT = process.env.SMTP_PORT;
const USER = process.env.SMTP_USER;
const PASS = process.env.SMTP_PASS;

import User from "../models/userModel.js";
import ProfileModel from "../models/ProfileModel.js";

// ------------------ SIGN IN ------------------
export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    const userProfile = await ProfileModel.findOne({ userId: existingUser?._id });

    if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ UPDATED FOR JWT v9
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECRET,
      { algorithm: "HS256", expiresIn: "1h" }
    );

    res.status(200).json({ result: existingUser, userProfile, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ------------------ SIGN UP ------------------
export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName, bio } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    const userProfile = await ProfileModel.findOne({ userId: existingUser?._id });

    if (existingUser) return res.status(400).json({ message: "User already exist" });
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords don't match" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
      bio,
    });

    // ✅ UPDATED FOR JWT v9
    const token = jwt.sign(
      { email: result.email, id: result._id },
      SECRET,
      { algorithm: "HS256", expiresIn: "1h" }
    );

    res.status(200).json({ result, userProfile, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ------------------ FORGOT PASSWORD ------------------
export const forgotPassword = (req, res) => {
  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    host: HOST,
    port: PORT,
    auth: { user: USER, pass: PASS },
    tls: { rejectUnauthorized: false },
  });

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return;
    }

    const token = buffer.toString("hex");

    User.findOne({ email: email }).then((user) => {
      if (!user) return res.status(422).json({ error: "User not found" });

      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;

      user
        .save()
        .then(() => {
          transporter.sendMail({
            to: user.email,
            from: "Accountill <hello@accountill.com>",
            subject: "Password reset request",
            html: `
              <p>You requested a password reset from Arc Invoicing.</p>
              <h5>Please click this <a href="https://accountill.com/reset/${token}">link</a> to reset your password</h5>
              <p>If this was a mistake, just ignore this email.</p>
            `,
          });
          res.json({ message: "Check your email for reset instructions" });
        })
        .catch((err) => console.log(err));
    });
  });
};

// ------------------ RESET PASSWORD ------------------
export const resetPassword = (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;

  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) return res.status(422).json({ error: "Session expired, try again" });

      bcrypt.hash(newPassword, 12).then((hashedPassword) => {
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.expireToken = undefined;

        user.save().then(() => {
          res.json({ message: "Password updated successfully" });
        });
      });
    })
    .catch((err) => console.log(err));
};
