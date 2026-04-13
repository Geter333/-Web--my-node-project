const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Назва страви є обов’язковою'],
        trim: true
    },
    ingredients: {
        type: [String],
        required: [true, 'Додайте хоча б один інгредієнт']
    },
    steps: {
        type: String,
        required: [true, 'Опис процесу приготування є обов’язковим']
    },
    cookTime: {
        type: Number,
        required: [true, 'Вкажіть час приготування'],
        min: [1, 'Час не може бути менше 1 хвилини']
    },
    cuisine: {
        type: String,
        required: [true, 'Вкажіть тип кухні'],
        trim: true
    },
        createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Рецепт повинен мати автора']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Recipe', recipeSchema);