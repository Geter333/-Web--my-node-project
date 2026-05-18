const Joi = require('joi');

exports.createRecipeSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Назва має містити мінімум 3 символи',
    'any.required': 'Назва є обов\'язковою'
  }),
  ingredients: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'Додайте хоча б один інгредієнт'
  }),
  steps: Joi.string().min(10).required().messages({
    'string.min': 'Опис процесу має містити мінімум 10 символів'
  }),
  cookTime: Joi.number().min(1).required().messages({
    'number.min': 'Час приготування не може бути менше 1 хвилини'
  }),
  cuisine: Joi.string().required().messages({
    'any.required': 'Тип кухні є обов\'язковим'
  })
});

exports.updateRecipeSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  ingredients: Joi.array().items(Joi.string()).min(1),
  steps: Joi.string().min(10),
  cookTime: Joi.number().min(1),
  cuisine: Joi.string()
}).min(1); // Вимагати хоча б одне поле для оновлення
