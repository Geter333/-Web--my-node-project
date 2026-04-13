require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');
const authRoutes = require('./routes/authRoutes');

const app = express();

dns.setServers(['8.8.8.8', '1.1.1.1']);

app.use(express.json());

app.use('/api/auth', authRoutes);

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