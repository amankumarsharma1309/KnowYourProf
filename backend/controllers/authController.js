import bcrypt from "bcryptjs";
import User from "../models/User.js";
import PendingUser from "../models/PendingUser.js";
import transporter from "../config/mail.js";
import generateOTP from "../utils/generateOTP.js";


export const sendOTP = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const otp = generateOTP();

    const hashedPassword = await bcrypt.hash(password, 10);

    await PendingUser.findOneAndDelete({ email });

    await PendingUser.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Professor Insight OTP Verification",
      html: `
        <h2>Professor Insight</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};