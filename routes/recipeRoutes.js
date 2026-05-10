const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const restrictTo = require('../middleware/restrictTo');
const {
    getAllRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe
} = require('../controllers/recipeController');

// Маршрут для отримання всіх рецептів (ПУБЛІЧНИЙ)
router.get('/', getAllRecipes);
router.get('/:id', getRecipe);

// Маршрути для створення та редагування (ЗАХИЩЕНІ)
router.post('/', protect, createRecipe);
router.put('/:id', protect, updateRecipe);

router.delete('/:id', protect, restrictTo('admin'), deleteRecipe);

module.exports = router;
