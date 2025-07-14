const jwt = require("jsonwebtoken");
const User = require('../model/auth')

const verifyCurrentUser = async (req, res, next) => {
    let token = req.header("Authorization");
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length).trimLeft();
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided."
        });
    }

    // console.log("token:: " + token);

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        // req.user = decoded;
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user._id
        next();
    } catch (error) {
        let message = "Invalid token";

        if (error.name === 'TokenExpiredError') {
            message = "Token expired. Please login again.";
        } else if (error.name === 'JsonWebTokenError') {
            message = "Invalid token. Please login again.";
        }

        res.status(401).json({
            success: false,
            message: message,
            error: error.name
        });
    }
};

module.exports = verifyCurrentUser;