const Joi = require('joi');

const createRecipeSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'Назва страви є обов’язковою',
    'any.required': 'Назва страви є обов’язковою'
  }),
  ingredients: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'Додайте хоча б один інгредієнт',
    'any.required': 'Інгредієнти є обов’язковими'
  }),
  steps: Joi.string().required().messages({
    'string.empty': 'Опис процесу приготування є обов’язковим',
    'any.required': 'Опис процесу приготування є обов’язковим'
  }),
  cookTime: Joi.number().min(1).required().messages({
    'number.min': 'Час не може бути менше 1 хвилини',
    'any.required': 'Вкажіть час приготування'
  }),
  cuisine: Joi.string().required().messages({
    'string.empty': 'Вкажіть тип кухні',
    'any.required': 'Вкажіть тип кухні'
  })
});

const updateRecipeSchema = Joi.object({
  title: Joi.string(),
  ingredients: Joi.array().items(Joi.string()).min(1),
  steps: Joi.string(),
  cookTime: Joi.number().min(1),
  cuisine: Joi.string()
}).min(1);

module.exports = {
  createRecipeSchema,
  updateRecipeSchema
};
