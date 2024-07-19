require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').split(' ')[1];
        // console.log(token, "token from auth middleware");
        if (!token) return res.status(401).json({ success: false, message: 'Access Denied! You are not authorized!' });
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        // console.log(verified, "verified from auth middleware");
        req.user = verified;

        next();
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err
        });
    }
}

module.exports = auth;