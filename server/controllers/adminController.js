const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

/**
 * @desc    Get complete administrative KPI metrics & platform stats
 * @route   GET /api/admin/stats
 * @access  Private (Admin Only)
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalFarmers,
      totalExperts,
      totalAdmins,
      blockedUsers,
      totalPosts,
      totalAnnouncements,
      totalComments,
      categoryStats,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'farmer' }),
      User.countDocuments({ role: 'expert' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ isBlocked: true }),
      Post.countDocuments(),
      Post.countDocuments({ isAnnouncement: true }),
      Comment.countDocuments(),
      Post.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      User.find()
        .select('-password -resetPasswordToken -resetPasswordExpire')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          farmers: totalFarmers,
          experts: totalExperts,
          admins: totalAdmins,
          blocked: blockedUsers,
        },
        posts: {
          total: totalPosts,
          announcements: totalAnnouncements,
        },
        comments: {
          total: totalComments,
        },
        categories: categoryStats,
        recentUsers,
      },
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error fetching admin statistics',
    });
  }
};

/**
 * @desc    Get all users with admin filters & status
 * @route   GET /api/admin/users
 * @access  Private (Admin Only)
 */
exports.getAllUsersAdmin = async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 15 } = req.query;

    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status === 'blocked') {
      query.isBlocked = true;
    } else if (status === 'active') {
      query.isBlocked = { $ne: true };
    }

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { village: { $regex: search.trim(), $options: 'i' } },
        { district: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 15;
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpire')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Aggregate user post counts
    const userIds = users.map((u) => u._id);
    const postCountsAgg = await Post.aggregate([
      { $match: { author: { $in: userIds } } },
      { $group: { _id: '$author', count: { $sum: 1 } } },
    ]);

    const postCountMap = {};
    postCountsAgg.forEach((p) => {
      postCountMap[p._id.toString()] = p.count;
    });

    const formattedUsers = users.map((u) => {
      const userObj = u.toObject();
      userObj.postCount = postCountMap[u._id.toString()] || 0;
      return userObj;
    });

    res.status(200).json({
      success: true,
      count: formattedUsers.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      users: formattedUsers,
    });
  } catch (error) {
    console.error('Admin Get Users Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error fetching user list for admin',
    });
  }
};

/**
 * @desc    Block or Unblock a user account
 * @route   PUT /api/admin/users/:id/block
 * @access  Private (Admin Only)
 */
exports.toggleBlockUser = async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot suspend your own administrator account',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: user.isBlocked
        ? `Account for ${user.name} has been suspended.`
        : `Account for ${user.name} has been reactivated.`,
      isBlocked: user.isBlocked,
      user,
    });
  } catch (error) {
    console.error('Admin Toggle Block Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error modifying user status',
    });
  }
};

/**
 * @desc    Update a user role (e.g. Promote Farmer to Agri Expert)
 * @route   PUT /api/admin/users/:id/role
 * @access  Private (Admin Only)
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['farmer', 'expert', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role. Must be farmer, expert, or admin',
      });
    }

    if (req.user.id === req.params.id && role !== 'admin') {
      return res.status(400).json({
        success: false,
        error: 'You cannot remove your own admin privileges',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Role for ${user.name} updated to '${role}'.`,
      user,
    });
  } catch (error) {
    console.error('Admin Update Role Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error updating user role',
    });
  }
};

/**
 * @desc    Delete user and cascade delete their posts and comments
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin Only)
 */
exports.deleteUserAdmin = async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot delete your own admin account',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Cascade delete: delete user's posts
    await Post.deleteMany({ author: user._id });

    // Cascade delete: delete user's comments
    await Comment.deleteMany({ author: user._id });

    // Delete user
    await User.findByIdAndDelete(user._id);

    res.status(200).json({
      success: true,
      message: `Account and associated posts for ${user.name} have been deleted.`,
    });
  } catch (error) {
    console.error('Admin Delete User Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error deleting user',
    });
  }
};
