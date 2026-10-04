const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 */
exports.createPost = async (req, res) => {
  try {
    const { title, content, crop, category, image, tags, isAnnouncement, location } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Post content cannot be empty',
      });
    }

    // Only Admins and Experts can create official announcements
    let announcementFlag = false;
    if (isAnnouncement) {
      if (req.user.role === 'admin' || req.user.role === 'expert') {
        announcementFlag = true;
      }
    }

    // Determine location from input or fallback to user profile
    const postLocation = {
      village: location?.village || req.user.village || '',
      district: location?.district || req.user.district || '',
      state: location?.state || req.user.state || 'Karnataka',
    };

    // Format tags if string
    let parsedTags = [];
    if (Array.isArray(tags)) {
      parsedTags = tags;
    } else if (typeof tags === 'string' && tags.trim()) {
      parsedTags = tags.split(',').map((t) => t.trim().replace(/^#/, ''));
    }

    const post = await Post.create({
      title: title?.trim() || '',
      content: content.trim(),
      crop: crop?.trim() || '',
      category: category || 'General',
      image: image || '',
      tags: parsedTags,
      author: req.user.id,
      isAnnouncement: announcementFlag,
      location: postLocation,
    });

    const populatedPost = await Post.findById(post._id).populate(
      'author',
      'name role village district state profilePic'
    );

    res.status(201).json({
      success: true,
      message: 'Post created successfully!',
      post: populatedPost,
    });
  } catch (error) {
    console.error('Create Post Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error creating post',
    });
  }
};

/**
 * @desc    Get all posts with filtering, search, pagination & sorting
 * @route   GET /api/posts
 * @access  Public
 */
exports.getPosts = async (req, res) => {
  try {
    const { category, crop, search, district, author, announcementOnly, sort, page = 1, limit = 10 } = req.query;

    const query = {};

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by crop
    if (crop) {
      query.crop = { $regex: crop, $options: 'i' };
    }

    // Filter by district
    if (district) {
      query['location.district'] = { $regex: district, $options: 'i' };
    }

    // Filter by author
    if (author) {
      query.author = author;
    }

    // Filter by announcement
    if (announcementOnly === 'true') {
      query.isAnnouncement = true;
    }

    // Search in title and content
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { crop: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Determine sorting
    let sortOptions = { isAnnouncement: -1, createdAt: -1 }; // Announcements always pin to top
    if (sort === 'popular') {
      sortOptions = { likes: -1, createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const totalPosts = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name role village district state profilePic')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Get comment counts for each post
    const postIds = posts.map((p) => p._id);
    const commentsAgg = await Comment.aggregate([
      { $match: { postId: { $in: postIds } } },
      { $group: { _id: '$postId', count: { $sum: 1 } } },
    ]);

    const commentCountMap = {};
    commentsAgg.forEach((c) => {
      commentCountMap[c._id.toString()] = c.count;
    });

    const formattedPosts = posts.map((p) => {
      const postObj = p.toObject();
      postObj.commentsCount = commentCountMap[p._id.toString()] || 0;
      return postObj;
    });

    res.status(200).json({
      success: true,
      count: formattedPosts.length,
      total: totalPosts,
      totalPages: Math.ceil(totalPosts / limitNum),
      currentPage: pageNum,
      posts: formattedPosts,
    });
  } catch (error) {
    console.error('Get Posts Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error fetching feed posts',
    });
  }
};

/**
 * @desc    Get single post by ID with author & comments
 * @route   GET /api/posts/:id
 * @access  Public
 */
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'author',
      'name role village district state profilePic'
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // Fetch comments for this post
    const comments = await Comment.find({ postId: req.params.id })
      .populate('author', 'name role village district state profilePic')
      .sort({ createdAt: 1 });

    const postObj = post.toObject();
    postObj.comments = comments;
    postObj.commentsCount = comments.length;

    res.status(200).json({
      success: true,
      post: postObj,
    });
  } catch (error) {
    console.error('Get Post By ID Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error fetching post',
    });
  }
};

/**
 * @desc    Update a post
 * @route   PUT /api/posts/:id
 * @access  Private (Author or Admin)
 */
exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // Check authorization: Must be the post author OR an admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to edit this post',
      });
    }

    const { title, content, crop, category, image, tags, isAnnouncement } = req.body;

    if (title !== undefined) post.title = title.trim();
    if (content !== undefined) post.content = content.trim();
    if (crop !== undefined) post.crop = crop.trim();
    if (category !== undefined) post.category = category;
    if (image !== undefined) post.image = image;
    if (tags !== undefined) {
      post.tags = Array.isArray(tags)
        ? tags
        : tags.split(',').map((t) => t.trim().replace(/^#/, ''));
    }

    if (isAnnouncement !== undefined && (req.user.role === 'admin' || req.user.role === 'expert')) {
      post.isAnnouncement = isAnnouncement;
    }

    await post.save();

    const updatedPost = await Post.findById(post._id).populate(
      'author',
      'name role village district state profilePic'
    );

    res.status(200).json({
      success: true,
      message: 'Post updated successfully!',
      post: updatedPost,
    });
  } catch (error) {
    console.error('Update Post Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error updating post',
    });
  }
};

/**
 * @desc    Delete a post and cascade delete comments
 * @route   DELETE /api/posts/:id
 * @access  Private (Author or Admin)
 */
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // Check authorization: Must be the post author OR an admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this post',
      });
    }

    // Delete associated comments
    await Comment.deleteMany({ postId: post._id });

    // Delete the post
    await Post.findByIdAndDelete(post._id);

    res.status(200).json({
      success: true,
      message: 'Post and associated comments deleted successfully!',
    });
  } catch (error) {
    console.error('Delete Post Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error deleting post',
    });
  }
};

/**
 * @desc    Get posts by user ID
 * @route   GET /api/posts/user/:userId
 * @access  Public
 */
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate('author', 'name role village district state profilePic')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error('Get User Posts Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error fetching user posts',
    });
  }
};

/**
 * @desc    Toggle Like / Unlike on a post
 * @route   PUT /api/posts/:id/like
 * @access  Private
 */
exports.toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    const isLiked = post.likes.some((userId) => userId.toString() === req.user.id);

    if (isLiked) {
      // Unlike: Remove user id from likes array
      post.likes = post.likes.filter((userId) => userId.toString() !== req.user.id);
    } else {
      // Like: Push user id to likes array
      post.likes.push(req.user.id);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: isLiked ? 'Post unliked' : 'Post liked!',
      isLiked: !isLiked,
      likesCount: post.likes.length,
      likes: post.likes,
    });
  } catch (error) {
    console.error('Toggle Like Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error toggling like',
    });
  }
};

