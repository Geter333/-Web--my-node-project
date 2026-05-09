const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Ім\'я є обов\'язковим'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email є обов\'язковим'],
        unique: true, // Гарантує унікальність
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Невірний формат email']
    },
    password: {
        type: String,
        required: [true, 'Пароль є обов\'язковим'],
        minlength: [8, 'Пароль має містити мінімум 8 символів'],
        select: false // Не повертати пароль у відповідях БД
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function() {
    // Якщо пароль не змінювали - не хешуємо його знову
    if (!this.isModified('password')) return;

    // Якщо пароль новий, хешуємо його
    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', userSchema);
