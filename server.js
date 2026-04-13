require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes'); // Нові маршрути рецептів
const AppError = require('./utils/AppError');
const app = express();

dns.setServers(['8.8.8.8', '1.1.1.1']);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes); 

app.use((req, res, next) => {
    next(new AppError(`Маршрут ${req.originalUrl} не знайдено на цьому сервері`, 404));
});

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    const message = err.isOperational ? err.message : 'Щось пішло не так на сервері';

    res.status(err.statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const startServer = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            family: 4 
        });
        
        console.log(`Успішно підключено до MongoDB Atlas: ${conn.connection.host}`);
        
        app.listen(process.env.PORT, () => {
            console.log(`Сервер запущено на порту ${process.env.PORT}`);
        });
        
    } catch (error) {
        console.error(`Помилка підключення до БД: ${error.message}`);
        process.exit(1); 
    }
};

startServer();