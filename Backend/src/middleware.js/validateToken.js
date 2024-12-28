import jwt from 'jsonwebtoken';

export const validateToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; // Correct property for cookies
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Token not provided' }); // Proper status code
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        if (decoded.id) {
            req.body.userId = decoded.id; // Attach the userId from the decoded token to req.body
        }
        req.user = decoded; // Attach the decoded payload to the request
        next(); // Proceed to the next middleware
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Server error' }); // Return a 500 for server errors
    }
};