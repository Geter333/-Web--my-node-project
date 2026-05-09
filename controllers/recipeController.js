const catchAsync = require('../utils/catchAsync');
const recipeService = require('../services/recipeService');
const { createRecipeSchema, updateRecipeSchema } = require('../validators/recipeValidator');
const AppError = require('../utils/AppError');

// GET: Отримати всі рецепти (Публічний)
exports.getAllRecipes = catchAsync(async (req, res) => {
    const data = await recipeService.getAllRecipes(req.query);
    res.status(200).json({ success: true, count: data.recipes.length, data });
});

// GET: Отримати один рецепт за ID
exports.getRecipe = catchAsync(async (req, res) => {
    const recipe = await recipeService.getRecipeById(req.params.id);
    res.status(200).json({ success: true, data: recipe });
});

// POST: Створити рецепт (Тільки для авторизованих)
exports.createRecipe = catchAsync(async (req, res, next) => {
    const { error } = createRecipeSchema.validate(req.body);
    if (error) {
        return next(new AppError(error.details[0].message, 400));
    }
    const recipe = await recipeService.createRecipe(req.body, req.user._id);
    res.status(201).json({ success: true, data: recipe });
});

// PUT: Оновити рецепт (Тільки для авторизованих)
exports.updateRecipe = catchAsync(async (req, res, next) => {
    const { error } = updateRecipeSchema.validate(req.body);
    if (error) {
        return next(new AppError(error.details[0].message, 400));
    }
    const recipe = await recipeService.updateRecipe(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: recipe });
});

// DELETE: Видалити рецепт (Тільки для ADMIN)
exports.deleteRecipe = catchAsync(async (req, res) => {
    await recipeService.deleteRecipe(req.params.id);
    res.status(200).json({ success: true, message: 'Рецепт успішно видалено' });
});
