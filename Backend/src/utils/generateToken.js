import jwt from "jsonwebtoken";

// A Function which is used to generate token and save into cookie
// while taking a userId and a response
const generateToken = (userId, res) => {
    // generating a token
    const token = jwt.sign(
        { id: userId }, process.env.JWT_SECRET, {expiresIn: "7d"}
    );
    // saving in cookie
    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 7*24*60*60*1000,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    });
    // returning the token
    return token;
};

export default generateToken;