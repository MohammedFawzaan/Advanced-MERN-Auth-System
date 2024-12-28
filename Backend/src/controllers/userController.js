import User from "../models/user.js";

const userData = async (req, res) => {
    const {userId} = req.body;
    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(400).json({message: "User Not Found"});
        }
        res.status(200).json({user});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: "Data Not Found"});
    }
}

export {userData};