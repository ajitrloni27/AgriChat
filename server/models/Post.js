const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Post content cannot be empty'],
      trim: true,
      maxlength: [2000, 'Content cannot exceed 2000 characters'],
    },
    image: {
      type: String,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Post must have an author'],
    },
    isAnnouncement: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: ['Crops', 'Pest Control', 'Weather', 'Market Prices', 'Govt Schemes', 'Machinery', 'General'],
      default: 'General',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index to optimize feed queries sorted by announcement flag and creation date
postSchema.index({ isAnnouncement: -1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
