import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import transporter from '../config/nodemailer.js';

const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all details" });
        }
        if (password < 6) {
            return res.status(400).json({ message: "Password must be atleast of 6 characters" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(200).json({ message: 'User is Already Registered' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email: email,
            name: name,
            password: hashedPassword
        });

        if (newUser) {
            const token = generateToken(newUser._id, res);
            await newUser.save();

            // sending welcome email
            // const mailOptions = {
            //     from: process.env.SENDER_EMAIL,
            //     to: email,
            //     subject: 'Welcome to My Website',
            //     text: `Your account has been created with email id ${email}`
            // }
            // await transporter.sendMail(mailOptions);

            res.status(201).json({ token: token });
        } else {
            res.status(400).json({ message: 'Invalid User data' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal error' });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Fill all details' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = generateToken(user._id, res);
        res.status(200).json({ token: token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal error' });
    }
}

const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out success" });
    } catch (error) {
        console.log("Error in logout", err.message);
    }
}

const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal error' });
    }
}

const sendVerifyOtp = async (req, res) => {
    try {
        // accessing the userId from the request body
        const { userId } = req.body;
        // Check if userId is provided
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        // Fetch the user from the database
        const user = await User.findById(userId);
        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // if user is verified
        if (user.isAccountVerified) {
            return res.status(200).json({ message: "Account Already verified" });
        }
        // creating a random number otp
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        // set otp in verifyOtp of user
        user.verifyOtp = otp;
        // set expiry time to 1 day
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        // save user data
        await user.save();
        // Sending the otp to email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account verification otp',
            text: `Your OTP is ${otp}. Please verify your account using this OTP.`
        }
        await transporter.sendMail(mailOptions);
        // sending the response
        res.status(200).json({ message: "Verification OTP sent on email" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const verifyEmail = async (req, res) => {
    // accessing the user id and otp from req.body
    const { userId, otp } = req.body;
    // if not userId and otp
    if (!userId || !otp) {
        return res.status(400).json({ message: "Missing Details" });
    }
    try {
        // accessing the user data
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // if verifyOtp is not correct
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        // if otp is expired
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({ message: "OTP Expired" });
        }
        // Now set the credentials to default
        user.isAccountVerified = true;
        user.verifyOtp = '';  
        user.verifyOtpExpireAt = '';  
        // Save the user 
        await user.save();
        // Send the response as Email Verified
        res.status(200).json({ message: "Email Verified Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const sendResetOtp = async (req, res) => {
    // accessing the email of current user from req.body
    const {email} = req.body;
    if(!email) {
        return res.status(400).json({message: 'Email is required'});
    }
    try {
        // accessing the user
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: "User Not Found"});
        }
        // creating a random number otp
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        // set otp in verifyOtp of user
        user.resetOtp = otp;
        // set expiry time to 1 day
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
        // save user data
        await user.save();
        // Sending the otp to email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset Otp',
            text: `Your OTP is ${otp}. Please reset your password of your account using this OTP.`
        }
        await transporter.sendMail(mailOptions);
        // Sending response 
        res.status(200).json({message: "Password Reset Otp sent to your email"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const resetPassword = async (req, res) => {
    // accessing details
    const {email, otp, newPassword} = req.body;
    try {
        // validations
        if(!email  || !otp || !newPassword) {
            res.status(400).json({message: "Fill All Details"});
        }
        if(newPassword < 6) {
            return res.status(400).json({ message: "Password must be atleast of 6 characters" });
        }
        // accessing user
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: "User Not Found"});
        }
        // checking for invalid otp
        if(user.resetOtp === '' || user.resetOtp !== otp) {
            return res.status(400).json({message: "Invalid OTP"});
        }
        // checking for expired otp
        if(user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({message: "OTP Expired"});
        }
        // generating hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        // updating user's password
        user.password = hashedPassword;
        // Now set the credentials to default
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        // Save the user
        await user.save();
        // Send the response
        res.status(200).json({message: "Password Has Been RESET Successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { login, signup, logout, checkAuth, sendVerifyOtp, verifyEmail, sendResetOtp, resetPassword };