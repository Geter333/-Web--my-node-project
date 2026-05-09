const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Ім\'я не може бути порожнім',
    'any.required': 'Ім\'я є обов\'язковим'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Невірний формат email',
    'any.required': 'Email є обов\'язковим'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Пароль має містити мінімум 8 символів',
    'any.required': 'Пароль є обов\'язковим'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Паролі не збігаються',
    'any.required': 'Підтвердження пароля є обов\'язковим'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Невірний формат email',
    'any.required': 'Email є обов\'язковим'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Пароль є обов\'язковим'
  })
});

module.exports = {
  registerSchema,
  loginSchema
};
