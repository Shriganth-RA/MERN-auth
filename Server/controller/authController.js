import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModels.js";
import transporter from "../config/nodeMailer.js";

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing dtails" });
    }

    try {
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.json({ success: false, message: "user already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        //Sending welcome email
        const mailOptions = {
            from: `"Shriganth Ravikumar" ${process.env.SENDER_EMAIL}`,
            to: email,
            subject: "Welcome to MERN-auth",
            text: `Welcome to MERN-auth website. Your account has been created with email id: ${email}`,
        };
        await transporter.sendMail(mailOptions);

        return res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({
            success: false,
            message: "Email and password are required",
        });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({
            success: true,
            userData: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
            },
        });
    } catch (error) {
        // res.json({ success: false, message: error.message })
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ success: true, message: "Logged out" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Send Verification OTP to the User's Email
export const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.user?.id;

        const user = await userModel.findById(userId);

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: `Shriganth Ravikumar ${process.env.SENDER_EMAIL}`,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your OTP is ${otp}, Verify your account using this OTP.`,
        };
        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Verification OTP Sent on Email" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Check the email is verified
export const verifyEmail = async (req, res) => {
    try {
        const { otp } = req.body;
        const userId = req.user.id;

        if (!userId || !otp) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.verifyOtp === "" || user.verifyOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: "Email Verified Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Check the email is authenticated
export const isAuthenticated = (req, res) => {
    if (req.user) {
        return res.status(200).json({ success: true, userId: req.user.id });
    } else {
        return res
            .status(401)
            .json({ success: false, message: "User not authenticated" });
    }
};

// Send password reset OTP
export const sendResetOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            res.json({ success: false, message: "Missing details." });
        }

        const user = await userModel.findOne({ email });

        if (user) {
            const otp = String(Math.floor(100000 + Math.random() * 900000));
            user.resetOtp = otp;
            user.resetOtpExpireAt = Date.now() + 15 * 60 * 10000;
            await user.save();

            const mailOptions = {
                from: `Shriganth Ravikumar ${process.env.SENDER_EMAIL}`,
                to: user.email,
                subject: "Passwor Reset OTP",
                text: `Your OTP for resetting your password is ${otp}, Use this OTP to proceed with resetting your password.`,
            };
            await transporter.sendMail(mailOptions);

            res.json({ success: true, message: "OTP sent to your Email" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Verify the Reset OTP
export const verifyResetOtp = async (req, res) => {
    try {
        const { userEmail, otp } = req.body;

        if (!userEmail) {
            return res.json({ success: false, message: "Email are required" });
        }

        if (!otp) {
            return res.json({ success: false, message: "OTP are required" });
        }

        const user = await userModel.findOne({ email: userEmail });
        if (!user) {
            return res.json({ success: false, message: "Invalid user" });
        }

        if (otp === "" || otp !== user.resetOtp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired" });
        }

        user.resetOtp = "";
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: "OTP verified successfully." });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Change your old password
export const resetPassword = async (req, res) => {
    try {
        const { userEmail, password } = req.body;

        if (!userEmail) {
            res.json({ success: false, message: "user email is required" });
        }

        if (!userEmail || !password) {
            res.json({ success: false, message: "New Password is required" });
        }

        const user = await userModel.findOne({ email: userEmail });
        if (!user) {
            res.json({ success: false, message: "Invalid user" });
        }

        user.password = await bcrypt.hash(password, 10);

        await user.save();

        res.json({ success: true, message: "Password changed successfully." });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
