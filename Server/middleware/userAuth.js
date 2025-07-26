import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    try {

        const { token } = req.cookies;

        if (!token) {
            return res.status(404).json({ success: false, message: "Not Authorized. Login Again." });
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            // req.body.userId = tokenDecode.id;
            req.user = { id: tokenDecode.id };
        } else {
            return res.status(404).json({ success: false, message: "Not Authorized. Login Again." });
        }

        next();

    } catch (error) {
        return res.status(400).json({ success: false, mssage: error.mssage })
    }
}

export default userAuth;