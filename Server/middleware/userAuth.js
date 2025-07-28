import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.id) {
            return res.status(401).json({ success: false, message: "Invalid Token. Login Again." });
        }

        // Attach user ID to the request
        req.user = { id: decoded.id };

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message || "Authorization Failed",
        });
    }
};

export default userAuth;
