require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet'); // Додано для безпеки
const morgan = require('morgan'); // Додано для логування
const dns = require('dns');

const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const AppError = require('./utils/AppError');

const app = express();
dns.setServers(['8.8.8.8', '1.1.1.1']);

// 1. Встановлюємо безпечні HTTP-заголовки
app.use(helmet());

// 2. Налаштування CORS
app.use(cors({
   origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
   credentials: true 
}));

// 3. Логування HTTP-запитів (тільки в режимі розробки)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(cookieParser()); 

// Маршрути
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes); 

// Обробник для неіснуючих маршрутів
app.use((req, res, next) => {
    next(new AppError(`Маршрут ${req.originalUrl} не знайдено на цьому сервері`, 404));
});

// 4. Глобальний обробник помилок з логікою для production/development
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let response = {
        success: false,
        message: err.message
    };

    // В режимі розробки додаємо більше деталей
    if (process.env.NODE_ENV === 'development') {
        console.error(`Помилка сервера [${req.method} ${req.originalUrl}]:`, err);
        response.stack = err.stack;
        response.error = err;
    } else { // В режимі production приховуємо деталі
        if (!err.isOperational) {
            console.error('КРИТИЧНА ПОМИЛКА:', err);
            response.message = 'Щось пішло не так на сервері!';
        }
    }

    res.status(err.statusCode).json(response);
});

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { family: 4 });
        console.log(`Успішно підключено до MongoDB Atlas`);
        
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Сервер запущено на порту ${PORT} в режимі '${process.env.NODE_ENV || 'development'}'`);
        });
        
    } catch (error) {
        console.error(`Помилка підключення до БД: ${error.message}`);
        process.exit(1); 
    }
};

startServer();
