const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Перевірка наявності токена в заголовку Authorization
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Доступ заборонено. Токен відсутній'
            });
        }

        // 2. Верифікація токена
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Пошук користувача за ID з токена
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({
                success: false,
                message: 'Користувача не знайдено'
            });
        }

        // 4. Додаємо користувача до об'єкта запиту
        req.user = currentUser;
        next();
    } catch (err) {
        res.status(401).json({
            success: false,
            message: 'Недійсний токен'
        });
    }
};

module.exports = protect;