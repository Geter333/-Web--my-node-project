const Recipe = require('../models/Recipe');
const AppError = require('../utils/AppError');

exports.getAllRecipes = async (query = {}) => {
  // Додаємо пагінацію та фільтрацію
  const { page = 1, limit = 10, cuisine } = query;
  
  const filter = {};
  if (cuisine) {
    filter.cuisine = cuisine;
  }
  
  const skip = (page - 1) * limit;

  const recipes = await Recipe.find(filter)
    .populate('createdBy', 'name email')
    .skip(skip)
    .limit(parseInt(limit));
    
  const total = await Recipe.countDocuments(filter);
  
  return {
    recipes,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    totalRecipes: total
  };
};

exports.getRecipeById = async (id) => {
  const recipe = await Recipe.findById(id).populate('createdBy', 'name email');
  if (!recipe) throw new AppError('Рецепт не знайдено', 404);
  return recipe;
};

exports.createRecipe = async (data, userId) => {
  return await Recipe.create({ ...data, createdBy: userId });
};

exports.updateRecipe = async (id, data, currentUser) => {
  const recipe = await Recipe.findById(id);
  if (!recipe) throw new AppError('Рецепт не знайдено', 404);

  // Перевірка власника
  if (
    recipe.createdBy.toString() !== currentUser._id.toString() &&
    currentUser.role !== 'admin'
  ) {
    throw new AppError('Ви не маєте прав редагувати цей запис', 403);
  }

  Object.assign(recipe, data);
  await recipe.save();
  return recipe;
};

exports.deleteRecipe = async (id) => {
  const recipe = await Recipe.findByIdAndDelete(id);
  if (!recipe) throw new AppError('Рецепт не знайдено', 404);
  return recipe;
};
