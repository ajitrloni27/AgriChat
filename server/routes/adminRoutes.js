const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsersAdmin,
  toggleBlockUser,
  updateUserRole,
  deleteUserAdmin,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsersAdmin);
router.put('/users/:id/block', toggleBlockUser);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUserAdmin);

module.exports = router;
