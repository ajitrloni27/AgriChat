const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsersAdmin,
  toggleBlockUser,
  updateUserRole,
  deleteUserAdmin,
  getAllPostsAdmin,
  togglePinAnnouncement,
  createAnnouncementAdmin,
  deletePostAdmin,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Stats & User Management
router.get('/stats', getDashboardStats);
router.get('/users', getAllUsersAdmin);
router.put('/users/:id/block', toggleBlockUser);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUserAdmin);

// Content Moderation & Announcements
router.get('/posts', getAllPostsAdmin);
router.post('/announcements', createAnnouncementAdmin);
router.put('/posts/:id/pin', togglePinAnnouncement);
router.delete('/posts/:id', deletePostAdmin);

module.exports = router;

