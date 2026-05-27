const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const authService = require('../services/authService');
const { registerSchema, loginSchema } = require('../validators/authValidators');
const AppError = require('../utils/AppError');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// Оновлені опції для cookie
const cookieOptions = {
    httpOnly: true,
    // В режимі production (на Render) cookie мають бути secure
    secure: process.env.NODE_ENV === 'production', 
    // Для cross-site запитів (Netlify -> Render) обов'язково 'none'
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 днів
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

    res.cookie('token', token, cookieOptions);

    res.status(201).json({
        success: true,
        message: 'Реєстрація успішна',
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
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

    console.log("Встановлюємо cookie для користувача:", user.email);
    res.cookie('token', token, cookieOptions);

    res.status(200).json({
        success: true,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// @desc    Вихід користувача (Очищення cookie)
// @route   POST /api/auth/logout
exports.logout = catchAsync(async (req, res) => {
    res.cookie('token', 'none', { ...cookieOptions, maxAge: 0 });
    res.status(200).json({ success: true, message: 'Вихід успішний' });
});

// @desc    Отримання профілю поточного користувача
// @route   GET /api/auth/me
exports.getMe = catchAsync(async (req, res) => {
    res.status(200).json({
        success: true,
        data: req.user
    });
});
