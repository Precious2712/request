const User = require("../model/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');

const generateToken = (id, email) => {
    return jwt.sign({ id, email }, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_LIFE_TIMEOUT
    });
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
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPassword = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="${resetUrl}">link</a> to reset your password</p>
            <p>This link will expire in 1 hour</p>
          `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'Password reset email sent'
        });
    } catch (error) {
        console.error('Error in forgot password:', error);
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
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

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

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
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
}

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