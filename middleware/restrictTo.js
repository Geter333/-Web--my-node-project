const AppError = require('../utils/AppError');

const restrictTo = (...roles) => {
    return (req, res, next) => {
        // req.user заповнюється попереднім middleware 'protect'
        if (!roles.includes(req.user.role)) {
            return next(new AppError('У вас немає прав для виконання цієї дії', 403));
        }
        next();
    };
};

module.exports = restrictTo;