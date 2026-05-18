const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const restrictTo = require('../middleware/restrictTo');
const validate = require('../middleware/validate');
const { createRecipeSchema, updateRecipeSchema } = require('../validators/recipeValidators');
const {
    getAllRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe
} = require('../controllers/recipeController');

// Підключаємо вкладений роутер для коментарів
const commentRouter = require('./commentRoutes');

router.get('/', getAllRecipes);
router.get('/:id', getRecipe);

// Застосовуємо middleware валідації
router.post('/', protect, validate(createRecipeSchema), createRecipe);
router.put('/:id', protect, validate(updateRecipeSchema), updateRecipe);

router.delete('/:id', protect, restrictTo('admin'), deleteRecipe);

// Перенаправляємо запити на /:recipeId/comments до commentRouter
router.use('/:recipeId/comments', commentRouter);

module.exports = router;
