const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  createIdea,
  getIdeas,
  getIdeaById,
  updateIdea,
  upvoteIdea,
  getMyIdeas
} = require('../controllers/ideaController');

// @route   POST api/ideas
// @desc    Create an idea
// @access  Private
router.post('/', auth, createIdea);

// @route   GET api/ideas
// @desc    Get all ideas
// @access  Public
router.get('/', getIdeas);

// @route   GET api/ideas/my-ideas
// @desc    Get current user's ideas
// @access  Private
router.get('/my-ideas', auth, getMyIdeas);

// @route   GET api/ideas/:id
// @desc    Get idea by ID
// @access  Public
router.get('/:id', getIdeaById);

// @route   PUT api/ideas/:id
// @desc    Update idea
// @access  Private
router.put('/:id', auth, updateIdea);

// @route   PUT api/ideas/:id/upvote
// @desc    Upvote an idea
// @access  Private
router.put('/:id/upvote', auth, upvoteIdea);

module.exports = router;
