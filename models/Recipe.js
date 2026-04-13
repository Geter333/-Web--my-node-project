const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    // Назва страви (title)
    title: {
        type: String,
        required: [true, 'Назва страви є обов’язковою'],
        trim: true
    },
    // Список інгредієнтів (ingredients)
    ingredients: {
        type: [String],
        required: [true, 'Додайте хоча б один інгредієнт']
    },
    // Покрокова інструкція (steps)
    steps: {
        type: String,
        required: [true, 'Опис процесу приготування є обов’язковим']
    },
    // Час приготування у хвилинах (cookTime)
    cookTime: {
        type: Number,
        required: [true, 'Вкажіть час приготування'],
        min: [1, 'Час не може бути менше 1 хвилини']
    },
    // Тип кухні (cuisine) 
    cuisine: {
        type: String,
        required: [true, 'Вкажіть тип кухні'],
        trim: true
    },
    // Посилання на автора (User)
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Recipe', recipeSchema);