import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

// Define the schema for the user
const userSchema = new Schema(
    {
        // Username field
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        // Email field
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        // Full name field
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        // Avatar field (cloudinary URL)
        avatar: {
            type: String,
            required: true
        },
        // Cover image field (cloudinary URL)
        coverImage: {
            type: String
        },
        
        // Password field (hashed)
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        // Refresh token field
        refreshToken: {
            type: String
        }
    },
    // Additional options
    {
        timestamps: true // Adds createdAt and updatedAt fields
    }
);

// Middleware function to hash the password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    try {
        if (!password || !this.password) {
            // Handle cases where either password or this.password is undefined
            return false;
        }
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        // Handle any errors that occur during password comparison
        throw new Error(error);
    }
};



userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

// Create and export the User model
export const User = mongoose.model("User", userSchema);
