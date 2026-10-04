const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getUserPosts,
  toggleLikePost,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// Include other resource routers
const commentRouter = require('./commentRoutes');

// Re-route into other resource routers
router.use('/:postId/comments', commentRouter);

// Public & Private CRUD routes
router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.put('/:id/like', protect, toggleLikePost);
router.get('/user/:userId', getUserPosts);

module.exports = router;

