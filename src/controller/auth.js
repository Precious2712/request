const User = require("../model/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const generateToken = (id, email) => {
    return jwt.sign({ id, email }, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_LIFE_TIMEOUT
    });
};

const generateRandomToken = () => {
    try {
        return crypto.randomBytes(32).toString('hex');
    } catch (error) {
        console.log("Crypto randomBytes not available, using fallback method");
        let token = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 64; i++) {
            token += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return token;
    }
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const signupUser = async (req, res) => {
    try {
        const { name, email, password, country } = req.body;

        if (!name || !email || !password || !country) {
            return res.status(400).json({
                message: 'All fields (name, email, password, contact) are required'
            });
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({
                message: 'User with this email already exists'
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.create({
            name: name,
            email: email,
            password: hashedPassword.trim(),
            country: country,
            // profileImage: req.file.path
        });

        res.status(201).json({
            message: 'User created successfully',
            data: user,
            expiresIn: process.env.JWT_LIFE_TIMEOUT,
            profileImage: user.profileImage
        });

        console.log('user', user);

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            message: 'Failed to create user',
            error: error.message
        });
    }
};

const loginUsers = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password is required'
            });
        }

        const user = await User.findOne({ email: email }).select('+password');;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email is required'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email is required'
            });
        }

        const token = generateToken(user._id, user.email);

        res.status(201).json({
            message: 'user login successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    contact: user.contact,
                    // profileImage: user.profileImage
                },
                tokenIn: token
            }
        })

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
}

const forgotPassword = async (req, res) => {
    console.log("Request body:", req.body);
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found with this email address'
            });
        }

        // Fix: Use the more reliable token generator
        const resetToken = generateRandomToken();

        // Fix: Use a more compatible hashing method
        const hashedToken = crypto.createHash
            ? crypto.createHash('sha256').update(resetToken).digest('hex')
            : resetToken; // Fallback if createHash is not available

        // Save hashed token to user
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
        await user.save({ validateBeforeSave: false });

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Password Reset Request</h2>
                    <p>Hello ${user.name},</p>
                    <p>You requested a password reset for your account.</p>
                    <p>Click the button below to reset your password:</p>
                    <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    <p>Or copy and paste this link in your browser:</p>
                    <p>${resetUrl}</p>
                    <p><strong>This link will expire in 1 hour.</strong></p>
                    <p>If you didn't request this password reset, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'Password reset email sent successfully'
        });

    } catch (error) {
        console.error('Error in forgot password:', error);

        // Reset the fields if there was an error
        if (typeof user !== 'undefined' && user) {
            const user = await User.findOne({ email });
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save({ validateBeforeSave: false }).catch(err =>
                console.error('Error resetting user token fields:', err)
            );
        }

        res.status(500).json({
            success: false,
            message: 'Failed to process forgot password request',
            error: error.message
        });
    }
}

const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: 'Token and new password are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Fix: Use a more compatible hashing method
        const hashedToken = crypto.createHash
            ? crypto.createHash('sha256').update(token).digest('hex')
            : token; 

        // Find user with valid reset token that hasn't expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Update user password and clear reset fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });

    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset password',
            error: error.message
        });
    }
};

const checkCurrentUser = async (req, res) => {
    try {
        const userId = await User.findById(req.user)
        if (!userId) {
            res.status(400).json({
                message: 'No user found'
            })
        }
        res.status(201).json({
            message: 'User found in database',
            data: userId
        })
    } catch (error) {
        res.status(400).json({
            message: 'No user found',
            error: error.message
        })
    }
}


module.exports = {
    signupUser,
    loginUsers,
    forgotPassword,
    resetPassword,
    checkCurrentUser
};