import userModel from "../models/userModels.js";

export const userController = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(404).json({ success: false, message: "Missing details." });
        }

        const user = await userModel.findById( userId );
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, userData: { name: user.name, email: user.email, isAccountVerified: user.isAccountVerified } });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}