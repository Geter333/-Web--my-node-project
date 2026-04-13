const express = require('express');
const router = express.Router();

// Імпортуємо функцію register з контролера
const { register } = require('../controllers/authController');

// Створюємо POST маршрут
router.post('/register', register);

module.exports = router;