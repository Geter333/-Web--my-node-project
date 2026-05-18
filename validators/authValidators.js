const Joi = require('joi');

exports.registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Ім\'я має містити мінімум 2 символи',
    'any.required': 'Ім\'я обов\'язкове'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Введіть коректний email',
    'any.required': 'Email обов\'язковий'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Пароль має містити мінімум 8 символів',
    'any.required': 'Пароль обов\'язковий'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Паролі не збігаються',
    'any.required': 'Підтвердження пароля обов\'язкове'
  })
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Введіть коректний email',
    'any.required': 'Email обов\'язковий'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Пароль обов\'язковий'
  })
});
