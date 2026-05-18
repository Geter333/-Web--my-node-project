const express = require('express');
const router = express.Router({ mergeParams: true }); // ВАЖЛИВО!
const protect = require('../middleware/protect');
const validate = require('../middleware/validate');
const { createCommentSchema } = require('../validators/commentValidators');
const { getComments, createComment, deleteComment } = require('../controllers/commentController');

// GET /api/recipes/:recipeId/comments
router.get('/', getComments);

// POST /api/recipes/:recipeId/comments
router.post('/', protect, validate(createCommentSchema), createComment);

// DELETE /api/recipes/:recipeId/comments/:id
router.delete('/:id', protect, deleteComment);

module.exports = router;
