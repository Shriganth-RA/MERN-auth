import userModel from "../models/userModels.js";

export const userController = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            res.json({ success: false, message: "Missing details." });
        }

        const user = await userModel.findById( userId );
        if (!user) {
            res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: { name: user.name, email: user.email, isAccountVerified: user.isAccountVerified } });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}