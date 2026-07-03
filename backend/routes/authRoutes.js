const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const express = require("express");
const PendingUser = require("../models/PendingUser");
const transporter = require("../config/mail");
const generateOTP = require("../utils/generateOTP");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

router.post("/send-otp", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email.endsWith("@nitkkr.ac.in")) {
            return res.status(400).json({
                message: "Only NIT KKR email addresses are allowed"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
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
            otpExpiry: new Date(Date.now() + 5 * 60 * 1000)
        });

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Professor Insight - Email Verification",
            html: `
                <h2>Professor Insight</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>This OTP will expire in 5 minutes.</p>
            `
        });

        res.status(200).json({
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to send OTP"
        });
    }
});

router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        const pendingUser = await PendingUser.findOne({ email });

        if (!pendingUser) {
            return res.status(400).json({
                message: "No pending registration found"
            });
        }

        if (pendingUser.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        if (pendingUser.otpExpiry < new Date()) {
            await PendingUser.deleteOne({ email });

            return res.status(400).json({
                message: "OTP has expired"
            });
        }

        const user = await User.create({
            name: pendingUser.name,
            email: pendingUser.email,
            password: pendingUser.password
        });
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        await PendingUser.deleteOne({ email });

        res.status(201).json({
            message: "Registration successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }
        if (user.provider === "google") {
            return res.status(400).json({
                message: "This account uses Google Sign-In. Please continue with Google."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }
        console.log("LOGIN SECRET:", process.env.JWT_SECRET);

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.post("/google", async (req, res) => {
    try {
        const { credential, type } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const { name, email } = payload;
        if (!email.endsWith("@nitkkr.ac.in")) {
            return res.status(403).json({
                message: "Only NIT KURUKSHETRA email addresses are allowed"
            });
        }

        let user = await User.findOne({ email });
        if (type === "register" && user) {
            return res.status(400).json({
                message: "Account already exists. Please login."
            });
        }

        if (type === "login" && !user) {
            user = new User({
                name,
                email,
                provider: "google",
            });

            await user.save();
        }

        if (type === "register" && !user) {
            user = new User({
                name,
                email,
                provider: "google",
            });

            await user.save();
        }


        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.json({
            token,
            user,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Google authentication failed",
        });
    }
});

module.exports = router;