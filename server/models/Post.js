const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Post content cannot be empty'],
      trim: true,
      maxlength: [3000, 'Content cannot exceed 3000 characters'],
    },
    crop: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: ['Crops', 'Pest Control', 'Weather', 'Market Prices', 'Govt Schemes', 'Machinery', 'General'],
      default: 'General',
    },
    image: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Post must have an author'],
    },
    isAnnouncement: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    location: {
      village: { type: String, default: '' },
      district: { type: String, default: '' },
      state: { type: String, default: 'Karnataka' },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for comment count & likes count
postSchema.virtual('likesCount').get(function () {
  return this.likes ? this.likes.length : 0;
});

// Compound indexes to optimize feed queries
postSchema.index({ isAnnouncement: -1, createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);

