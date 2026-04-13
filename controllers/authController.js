const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Допоміжна функція для генерації JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// @desc    Реєстрація нового користувача
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // 1. Перевірка наявності всіх полів
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Всі поля є обов\'язковими для заповнення'
            });
        }

        // 2. Перевірка збігу паролів
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Паролі не збігаються'
            });
        }

        // 3. Перевірка, чи не існує вже такий користувач
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Користувач з таким email вже існує'
            });
        }

        // 4. Хешування пароля
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 5. Збереження нового користувача в БД
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // 6. Формування успішної відповіді (без пароля!)
        res.status(201).json({
            success: true,
            message: 'Реєстрація успішна',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Вхід користувача (Авторизація)
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Перевірка, чи введені дані
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Введіть email та пароль'
            });
        }

        // 2. Пошук користувача + примусове додавання поля password 
        const user = await User.findOne({ email }).select('+password');

        // 3. Перевірка користувача та пароля
        // Використовуємо однакову помилку для email та пароля заради безпеки
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: 'Невірний email або пароль'
            });
        }

        // 4. Створення токена
        const token = generateToken(user._id, user.role);

        // 5. Відповідь
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

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Отримання профілю поточного користувача
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
    try {
        // req.user заповнюється в middleware/protect.js
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};