const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getUserPosts,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// Public & Private CRUD routes
router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.get('/user/:userId', getUserPosts);

module.exports = router;
