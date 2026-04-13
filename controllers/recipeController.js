const Recipe = require('../models/Recipe');
const AppError = require('../utils/AppError');

// GET: Отримати всі рецепти (Публічний)
exports.getAllRecipes = async (req, res, next) => {
    try {
        const recipes = await Recipe.find().populate('createdBy', 'name email');
        res.status(200).json({ success: true, count: recipes.length, data: recipes });
    } catch (err) { next(err); }
};

// GET: Отримати один рецепт за ID
exports.getRecipe = async (req, res, next) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return next(new AppError('Рецепт не знайдено', 404));
        res.status(200).json({ success: true, data: recipe });
    } catch (err) { next(err); }
};

// POST: Створити рецепт (Тільки для авторизованих)
exports.createRecipe = async (req, res, next) => {
    try {
        const recipe = await Recipe.create({
            ...req.body,
            createdBy: req.user._id // Беремо ID з токена, а не з тіла запиту!
        });
        res.status(201).json({ success: true, data: recipe });
    } catch (err) { next(err); }
};

// PUT: Оновити рецепт (Тільки для авторизованих)
exports.updateRecipe = async (req, res, next) => {
    try {
        const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        });
        if (!recipe) return next(new AppError('Рецепт не знайдено', 404));
        res.status(200).json({ success: true, data: recipe });
    } catch (err) { next(err); }
};

// DELETE: Видалити рецепт (Тільки для ADMIN)
exports.deleteRecipe = async (req, res, next) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!recipe) return next(new AppError('Рецепт не знайдено', 404));
        res.status(200).json({ success: true, message: 'Рецепт успішно видалено' });
    } catch (err) { next(err); }
};