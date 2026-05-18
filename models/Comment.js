const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Текст коментаря є обов\'язковим'],
    trim: true,
    minlength: 5,
    maxlength: 500
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Один користувач – один коментар до одного рецепта
commentSchema.index({ recipe: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Comment', commentSchema);
