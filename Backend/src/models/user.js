import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    verifyOtp: {
        type: String,
        default: '',
    },
    verifyOtpExpireAt: {
        type: Number,
        default: 0,
    },
    isAccountVerified: {
        type: Boolean,
        default: false,
    },
    resetOtp: {
        type: String,
        default: '',
    },
    resetOtpExpireAt: {
        type: Number,
        default: 0,
    }
}, {timestamps: true});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;