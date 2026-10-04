const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  addComment,
  getCommentsByPost,
  deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// /api/posts/:postId/comments OR /api/comments
router.route('/')
  .get(getCommentsByPost)
  .post(protect, addComment);

router.route('/:id')
  .delete(protect, deleteComment);

module.exports = router;
