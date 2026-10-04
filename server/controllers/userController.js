const User = require('../models/User');
const Post = require('../models/Post');

/**
 * @desc    Get all community members (Farmers, Experts, Admins) with filtering
 * @route   GET /api/users
 * @access  Public
 */
exports.getUsers = async (req, res) => {
  try {
    const { role, district, search, page = 1, limit = 12 } = req.query;

    const query = { isBlocked: { $ne: true } };

    // Filter by role
    if (role && role !== 'all') {
      query.role = role;
    }

    // Filter by district
    if (district && district !== 'All Districts') {
      query.district = { $regex: district, $options: 'i' };
    }

    // Search by name or village
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { village: { $regex: search.trim(), $options: 'i' } },
        { district: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpire')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get post counts for each user
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
      total: totalUsers,
      totalPages: Math.ceil(totalUsers / limitNum),
      currentPage: pageNum,
      users: formattedUsers,
    });
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error fetching directory users',
    });
  }
};

/**
 * @desc    Get single user profile by ID with their posts
 * @route   GET /api/users/:id
 * @access  Public
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      '-password -resetPasswordToken -resetPasswordExpire'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const posts = await Post.find({ author: user._id })
      .populate('author', 'name role village district state profilePic')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      user,
      posts,
      postCount: posts.length,
    });
  } catch (error) {
    console.error('Get User By ID Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error fetching user details',
    });
  }
};
