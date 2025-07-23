import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    try {

        const { token } = req.cookies;

        if (!token) {
            res.json({ success: false, message: "Not Authorized. Login Again." });
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            req.body.userId = tokenDecode.id;
        } else {
            res.json({ success: false, message: "Not Authorized. Login Again." });
        }

        next();

    } catch (error) {
        res.json({ success: false, mssage: error.mssage })
    }
}

export default userAuth;