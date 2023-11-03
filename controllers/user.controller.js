import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto';

const cookieOptions = {
    maxAge: 7*24*60*60*1000,    //7 days
    httpOnly: true,      // For security purpose
    secure: true
};

const register = async (req, res, next) => {                  
    const { fullName, email, password } = req.body;           // 1. Fetch data from body which user enter

    if (!fullName || !email || !password) {                   // 2. Check all data filled or not
        return next(new AppError('All fields are required', 400));
    }

    const userExists = await User.findOne({ email });        // 3. Check user don't exists allready

    if (userExists) {
        return next(new AppError('Email already exists', 400))
    }

    const user = await User.create({                       // 4. If user not exist Create a user
        fullName,
        email,
        password,
        avatar: {
            public_id: email,
            secure_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDvYYiAt_WjzQ5lueNSWMwHNjp7UV5mjBXOg&usqp=CAU'
        }
    })

    if (!user) {                                        // 5. If user not created for any reason throw this error
        return next(new AppError('User registration failed, please try again', 400))
    }

    // Todo: File upload
    console.log('File Details > ', JSON.stringify(req.file));
    if (req.file) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms',
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill'
            })

            if (result) {
                user.avatar.public_id = result.public_id;       // Update user public & secure _id
                user.avatar.secure_url = result.secure_url;

                // Remove file from server or, localhost
                fs.rm(`uploads/${req.file.filename}`)
            }
        } catch (err) {
            return next(
                new AppError(error || 'File not uploaded, please try again', 500)
            )
        }
    } 

    await user.save();                                  // 6. Svae user

    user.password = undefined;                          //7. undefine user password 

    const token = await user.generateJWTToken();         // 8. if user register successfully create a token for user to not login again and again
    // console.log(token);

    res.cookie('token', token, cookieOptions);         // 9. Storing this token in cookie

    res.status(201).json({                              // 10. If Registration successfully show this message
        success: true,
        message: 'User register successfully',
        user
    })
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;               // 1. Fetching data filled by user 
    
        if (!email || !password) {                          // 2. Insuring email and password both are filled by user
            return next(new AppError('All field are required', 400))
        }
    
        const user = await User.findOne({                  // 3. Searching this email in Database exists or not
            email
        }).select('+password');
    
        if (!user && !user.comparePassword(password)) {     // 4. If email Or, password not match thorw message
            return next(new AppError('Email or password does not match', 400));
        }
    
        const token = await user.generateJWTToken();        // 5. if user login successfully create a token for user to not login again and again
        console.log("token is>" ,token);
        user.password = undefined;                          // 6. undefine user password 
    
        res.cookie('token', token, cookieOptions);         // 7. Storing this token in cookie
    
        res.status(200).json({                              // 8. If login successfully show this message
            success: true,
            message: 'User loggedin Successfully',
            user
        })
        
    } catch (err) {
        return next(new AppError(err.message, 500))
    }
};

const logout = (req, res) => {                  // 1. Delete token from cookie Or, set token value null
    res.cookie('token', null, {
        secure: true,
        maxAge: 0,
        httpOnly: true
    });

    res.status(200).json({                  // 2. Send message logout successfully
        success: true,
        message: "User logged out Successfully"
    })
};

const getProfile = async (req, res, next) => {
    try {
          // 1. Finding user from DB
        const userId = req.user.id;
        const user = await User.findById(userId);
        console.log("USER : ", user.fullName);

        res.status(200).json({
            success: true,
            message: 'User details',
            user
        })

    } catch (err) {
        return next(new AppError('Failed to fetch profile detail', 400));
    }
};

const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError('Email is required1', 400));
    }

    const user = await User.findOne({email});
    if (!user) {
        next(new AppError('Email not register', 400));
    }

    const resetToken = await user.generatePasswordResetToken();

    await user.save();                      // why save user instead of token?

    const resetPasswordURL = `${process.env.FRONTEND_URL}/reset/${resetToken}`;

    console.log(resetPasswordURL);

    const subject = 'Reset Password';
    const message = `You can reset your password by clicking <a href=${resetPasswordURL} target="_blank">Reset your password</a>\n If the above link does not work for some reason then copy paste this link in new tab ${resetPasswordURL}.\n If you have not requested this, kindely ignored!`;
    try {
        await sendEmail(email, subject, message);

        res.status(200).json({
            success: true,
            message: `Reset password token has been sent to ${email} successfully`
        })
    } catch(err) {

        user.forgotPasswordExpiry = undefined;
        user.forgotPasswordToken = undefined;

        await user.save();                          // why save user instead of token?
        return next(new AppError(err.message, 400));
    }
};

const resetPassword = async (req, res, next) => {
    const { resetToken } = req.params;

    const { password } = req.body;

    const forgotPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    const user = await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry: { $gt: Date.now }
    });

    if (!user) {
        return next(new AppError('Token is invalid or expired, please try again', 400));
    }

    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    user.save();

    res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    })
};

const changePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;

    if (!oldPassword || !newPassword) {
        return next(new AppError('All fields are mandatory', 400));
    }

    const user = await User.findById(id).select('+password');

    if (!user) {
        return next(new AppError('User does not Exist', 400));      // Here, we search user logedinn or not
    }

    const isPasswordValid = await user.comparePassword(oldPassword);        // Here, we compared oldPassword with password wich store in DB

    if (!isPasswordValid) {
        return next(new AppError('Invalid old password', 400));
    }

    user.password = newPassword;

    await user.save();

    user.password = undefined;

    res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    });
}

const updateUser = async (req, res, next) => {
    const { fullName } = req.body;
    console.log("fullName : ", fullName);
    const id = req.user.id;


    const user = await User.findById(id);

    if (!user) {
        return next(new AppError('User does not exist', 400));
    }

    if (fullName) {
        user.fullName = fullName;
    }

    if (req.file) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms',
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill'
            })

            if (result) {
                user.avatar.public_id = result.public_id;       // Update user public & secure _id
                user.avatar.secure_url = result.secure_url;

                // Remove file from server or, localhost
                fs.rm(`uploads/${req.file.filename}`)
            }
        } catch (err) {
            return next(
                new AppError(error || 'File not uploaded, please try again', 500)
            )
        }
    }

    await user.save();
    console.log("USER 22 : ", user.fullName);

    res.status(200).json({
        success: true,
        message: 'User details updated successfully'
    })
}

export {
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser
}
