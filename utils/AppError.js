class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Позначаємо, що це помилка, яку ми створили свідомо
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;