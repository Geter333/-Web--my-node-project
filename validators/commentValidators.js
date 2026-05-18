const Joi = require('joi');

exports.createCommentSchema = Joi.object({
  text: Joi.string().min(5).max(500).required().messages({
    'string.min': 'Коментар має містити мінімум 5 символів',
    'string.max': 'Коментар не може перевищувати 500 символів',
    'any.required': 'Текст коментаря є обов\'язковим'
  })
});
