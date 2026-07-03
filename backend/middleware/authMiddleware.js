const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        console.log(token);

        if (!token) {
            return res.status(401).json({
                message: "Access denied"
            });
        }
        console.log("VERIFY SECRET:", process.env.JWT_SECRET);
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log(decoded);

        req.userId = decoded.userId;
        req.role = decoded.role;

        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};

module.exports = authMiddleware;