const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 300,
    },
    problemStatement: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    difficultyScore: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    marketPotential: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High', 'Very High'],
    },
    visibility: {
      type: String,
      enum: ['Active', 'Hidden', 'Archived'],
      default: 'Active',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Idea', IdeaSchema);
