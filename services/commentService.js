const Comment = require('../models/Comment');
const AppError = require('../utils/AppError');

exports.getCommentsByRecipe = async (recipeId) => {
  return await Comment.find({ recipe: recipeId }).populate('user', 'name');
};

exports.createComment = async (data, recipeId, userId) => {
  // Перевірка, чи користувач вже залишав коментар
  const existingComment = await Comment.findOne({ recipe: recipeId, user: userId });
  if (existingComment) {
    throw new AppError('Ви вже залишили коментар до цього рецепта', 400);
  }

  return await Comment.create({
    ...data,
    recipe: recipeId,
    user: userId
  });
};

exports.deleteComment = async (commentId, currentUser) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new AppError('Коментар не знайдено', 404);
  }

  if (
    comment.user.toString() !== currentUser._id.toString() &&
    currentUser.role !== 'admin'
  ) {
    throw new AppError('Ви не маєте прав видалити цей коментар', 403);
  }

  await comment.deleteOne();
  return comment;
};
