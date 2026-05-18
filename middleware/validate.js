const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map(d => d.message);
    // Використовуємо AppError для централізованої обробки
    const AppError = require('../utils/AppError');
    return next(new AppError(messages.join(', '), 400));
  }
  next();
};

module.exports = validate;
