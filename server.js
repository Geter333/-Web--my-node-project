require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dns = require('dns');
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const AppError = require('./utils/AppError');
const app = express();

dns.setServers(['8.8.8.8', '1.1.1.1']);

app.use(cors({
   origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
   credentials: true 
}));

app.use(express.json());
app.use(cookieParser()); 

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes); 

app.use((req, res, next) => {
    next(new AppError(`Маршрут ${req.originalUrl} не знайдено на цьому сервері`, 404));
});

app.use((err, req, res, next) => {
    // Додаємо логування методу та URL, щоб точно знати, який запит викликає помилку
    console.error(`Помилка сервера [${req.method} ${req.originalUrl}]:`, err.message);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    const message = err.isOperational ? err.message : 'Щось пішло не так на сервері';

    res.status(err.statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        errorDetails: process.env.NODE_ENV === 'development' ? err : undefined
    });
});

const startServer = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            family: 4 
        });
        
        console.log(`Успішно підключено до MongoDB Atlas: ${conn.connection.host}`);
        
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Сервер запущено на порту ${process.env.PORT || 3000}`);
        });
        
    } catch (error) {
        console.error(`Помилка підключення до БД: ${error.message}`);
        process.exit(1); 
    }
};

startServer();