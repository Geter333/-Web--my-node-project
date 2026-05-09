const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const authService = require('../services/authService');
const { registerSchema, loginSchema } = require('../validators/authValidator');
const AppError = require('../utils/AppError');

// Допоміжна функція для генерації JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// @desc    Реєстрація нового користувача
// @route   POST /api/auth/register
exports.register = catchAsync(async (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return next(new AppError(error.details[0].message, 400));
    }
    const user = await authService.registerUser(req.body);
    const token = generateToken(user._id, user.role);

    res.status(201).json({
        success: true,
        message: 'Реєстрація успішна',
        token,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        }
    });
});

// @desc    Вхід користувача (Авторизація)
// @route   POST /api/auth/login
exports.login = catchAsync(async (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return next(new AppError(error.details[0].message, 400));
    }
    const user = await authService.loginUser(req.body);
    const token = generateToken(user._id, user.role);

    res.status(200).json({
        success: true,
        token,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// @desc    Отримання профілю поточного користувача
// @route   GET /api/auth/me
exports.getMe = catchAsync(async (req, res) => {
    // req.user заповнюється в middleware/protect.js
    res.status(200).json({
        success: true,
        data: req.user
    });
});
