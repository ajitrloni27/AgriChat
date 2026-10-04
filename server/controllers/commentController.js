const Comment = require('../models/Comment');
const Post = require('../models/Post');

/**
 * @desc    Add a comment to a post
 * @route   POST /api/posts/:postId/comments
 * @access  Private
 */
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Comment text cannot be empty',
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    const comment = await Comment.create({
      text: text.trim(),
      author: req.user.id,
      postId: post._id,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      'author',
      'name role village district state profilePic'
    );

    res.status(201).json({
      success: true,
      message: 'Comment added successfully!',
      comment: populatedComment,
    });
  } catch (error) {
    console.error('Add Comment Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error adding comment',
    });
  }
};

/**
 * @desc    Get all comments for a post
 * @route   GET /api/posts/:postId/comments
 * @access  Public
 */
exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId })
      .populate('author', 'name role village district state profilePic')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.error('Get Comments Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error fetching comments',
    });
  }
};

/**
 * @desc    Delete a comment
 * @route   DELETE /api/comments/:id
 * @access  Private (Comment author, Post author, or Admin)
 */
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found',
      });
    }

    const post = await Post.findById(comment.postId);

    // Permission check: Comment Author, Post Author, or Admin
    const isCommentAuthor = comment.author.toString() === req.user.id;
    const isPostAuthor = post && post.author.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this comment',
      });
    }

    await Comment.findByIdAndDelete(comment._id);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully!',
    });
  } catch (error) {
    console.error('Delete Comment Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error deleting comment',
    });
  }
};
