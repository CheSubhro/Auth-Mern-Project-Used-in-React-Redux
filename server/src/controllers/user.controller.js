
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import HttpStatus from '../utils/HttpStatus.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import { lowercase } from '../utils/StringUtils.js';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer';


const generateAccessAndRefereshTokens = async(userId) =>{

    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong while generating referesh and access token")
    }
}

// Function to move uploaded files to a destination directory
const moveFile = async (file, destination) => {
    const tempPath = file.path;
    const targetPath = path.resolve(process.cwd(), 'public', destination, file.filename);

    // Move the file from temp location to the destination
    fs.renameSync(tempPath, targetPath);

    return targetPath;
};


const registerUser = asyncHandler ( async (req,res) =>{

    // TODO:
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {fullName, email, username, password } = req.body
    //console.log("email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(HttpStatus.CONFLICT, "User with email or username already exists")
    }

    // Convert username to lowercase
    const lowercaseUsername = lowercase(username);

    //console.log(req.files);

    // Handle avatar and coverImage uploads
    const avatarPath = req.files?.avatar ? await moveFile(req.files.avatar[0], 'temp') : null;
    const coverImagePath = req.files?.coverImage ? await moveFile(req.files.coverImage[0], 'temp') : null;
 
    if (!avatarPath) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Avatar file is required');
    }

    const user = await User.create({
        fullName,
        avatar: avatarPath,
        coverImage: coverImagePath || '',
        email,
        password,
        username: lowercaseUsername,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong while registering the user")
    }

    return res.status(HttpStatus.CREATED).json(
        new ApiResponse(HttpStatus.OK, createdUser, "User registered Successfully")
    )


})

const loginUser = asyncHandler(async (req, res) => {
    
    // TODO:
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body
    // console.log(username);

    if (!username && !email) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(HttpStatus.NOT_FOUND, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(HttpStatus.OK)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            HttpStatus.OK, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
});

const logoutUser = asyncHandler (async(req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(HttpStatus.OK)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(HttpStatus.OK, {}, "User logged Out"))
});

const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(HttpStatus.UNAUTHORIZED, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(HttpStatus.UNAUTHORIZED, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(HttpStatus.OK)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                HttpStatus.OK, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, error?.message || "Invalid refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async(req, res) => {

    const { oldPassword, newPassword } = req.body;
    console.log('Old password from request:', oldPassword);

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    console.log('Is password correct:', isPasswordCorrect);

    if (!isPasswordCorrect) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(HttpStatus.OK)
    .json(new ApiResponse(HttpStatus.OK, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(HttpStatus.OK)
    .json(new ApiResponse(
        HttpStatus.OK,
        req.user,
        "User fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async(req, res) => {

    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(HttpStatus.OK)
    .json(new ApiResponse(HttpStatus.OK, user, "Account details updated successfully"))
});

const updateUserAvatar = asyncHandler(async (req, res) => {

    // TODO:
    // First Check Avatar Image 
    // Update Avatar Image
    // Delete Old Avatar Image
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Avatar file is missing");
    }

    const user = await User.findById(req.user?._id).select("-password");

    // Delete previous avatar image if it exists
    if (user.avatar) {
        try {
            await fs.unlink(user.avatar, (err) => {
                if (err) {
                    console.error('Error deleting previous avatar:', err);
                }
            }); // Delete the file
        } catch (error) {
            console.error('Error deleting previous avatar:', error);
        }
    }

    // Update the user document with the new avatar path
    user.avatar = avatarLocalPath;
    await user.save();

    return res.status(HttpStatus.OK).json(
        new ApiResponse(HttpStatus.OK, user, "Avatar image updated successfully")
    );
});
    
const updateUserCoverImage = asyncHandler(async(req, res) => {

    // TODO:
    // First Check Avatar Image 
    // Update Avatar Image
    // Delete Old Avatar Image

    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Cover image file is missing");
    }

    const user = await User.findById(req.user?._id).select("-password");

    // Delete previous cover image if it exists
    if (user.coverImage) {
        try {
            await fs.unlink(user.coverImage, (err) => {
                if (err) {
                    console.error('Error deleting previous cover image:', err);
                }
            }); // Delete the file
        } catch (error) {
            console.error('Error deleting previous cover image:', error);
        }
    }

    // Update the user document with the new cover image path
    user.coverImage = coverImageLocalPath;
    await user.save();

    return res.status(HttpStatus.OK).json(
        new ApiResponse(HttpStatus.OK, user, "Cover image updated successfully")
    );
    
})

// Function to send password reset email
const sendResetEmail = async (email, resetToken) => {

    const transporter = nodemailer.createTransport({
        
        host: 'smtp.example.com', // Your SMTP server host
        port: 587, // SMTP port (e.g., 587 for TLS)
        secure: false, // Set to true if using SSL/TLS
        auth: {
            user: 'your_email@example.com', // Your email address
            pass: 'your_password', // Your email password or app-specific password
        },
    });

    try {
        const resetLink = `${process.env.RESET_LINK_BASE_URL}/reset-password?token=${resetToken}`;

        await transporter.sendMail({
            from: 'your@example.com', // Sender's email address
            to: email, // Recipient's email address
            subject: 'Password Reset',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        });
    } catch (error) {
        
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email.');
    }
};

// Request password reset
const requestPasswordReset = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'User not found');
    }

    // Generate reset token
    const resetToken = generateResetToken(user._id);

    // Save reset token to user document
    user.resetToken = resetToken;
    await user.save();

    // Send reset email
    await sendResetEmail(email, resetToken);

    res.status(HttpStatus.OK).json({ message: 'Password reset instructions sent to your email' });
});

// Reset password
const resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    // Decode the reset token
    const decodedToken = jwt.verify(token, process.env.RESET_TOKEN_SECRET);

    // Find user by decoded user ID
    const user = await User.findById(decodedToken.userId);

    if (!user) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'User not found');
    }

    // Update user password
    user.password = newPassword;
    user.resetToken = undefined; // Clear the reset token
    await user.save();

    res.status(HttpStatus.OK).json({ message: 'Password reset successful' });

});


export {
    registerUser,
    loginUser,
    logoutUser,
    requestPasswordReset,
    resetPassword,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
}




