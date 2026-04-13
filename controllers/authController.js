const bcrypt = require('bcryptjs');
const User = require('../models/User');

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
        // Обробка помилок валідації Mongoose
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        // Загальна помилка сервера
        res.status(500).json({ success: false, message: err.message });
    }
};