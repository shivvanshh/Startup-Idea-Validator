const Idea = require('../models/Idea');

// Create a new idea
const createIdea = async (req, res) => {
  try {
    const {
      title,
      description,
      problemStatement,
      category,
      difficultyScore,
      marketPotential,
      visibility,
      expiresHours, // Use this to calculate expiresAt
    } = req.body;

    // Check if title already exists
    const existingIdea = await Idea.findOne({ title });
    if (existingIdea) {
      return res.status(400).json({ message: 'An idea with this title already exists.' });
    }

    let expiresAt = undefined;
    if (expiresHours && !isNaN(expiresHours)) {
      expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + parseInt(expiresHours));
    }

    const newIdea = new Idea({
      title,
      description,
      problemStatement,
      category,
      difficultyScore,
      marketPotential,
      visibility: visibility || 'Active',
      author: req.user.id,
      expiresAt,
    });

    const idea = await newIdea.save();
    res.status(201).json(idea);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all valid ideas (for dashboard)
// Includes search and filter functionality
const getIdeas = async (req, res) => {
  try {
    const { search, category, difficulty, market, sortBy } = req.query;

    // Build query
    let query = {
      $or: [
        { visibility: 'Active' },
      ]
    };

    // For expired logic: only show ideas that haven't expired, or don't have an expiry
    const now = new Date();
    query = {
      ...query,
      $and: [
        {
          $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: { $eq: null } },
            { expiresAt: { $gt: now } }
          ]
        }
      ]
    };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (difficulty) {
      query.difficultyScore = difficulty;
    }
    if (market) {
      query.marketPotential = market;
    }

    // Build sort based on trending logic
    // Idea Score = (Market Potential × 2) + Difficulty Score + Upvotes
    // Mongoose doesn't easily sort by calculated arrays size inline for this complex formula easily without aggregation
    // So we fetch and sort in memory if trending is requested, otherwise standard sort
    
    let ideas = await Idea.find(query)
      .populate('author', 'username')
      .sort({ createdAt: -1 }); // Default sort by newest

    if (sortBy === 'trending') {
      const getMarketValue = (market) => {
        const values = { 'Low': 1, 'Medium': 2, 'High': 3, 'Very High': 4 };
        return values[market] || 1;
      };

      ideas = ideas.sort((a, b) => {
        const scoreA = (getMarketValue(a.marketPotential) * 2) + a.difficultyScore + a.upvotes.length;
        const scoreB = (getMarketValue(b.marketPotential) * 2) + b.difficultyScore + b.upvotes.length;
        return scoreB - scoreA; // Descending
      });
    }

    res.json(ideas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get single idea by ID and increment view count
const getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
      .populate('author', 'username');

    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    // Increment view count
    idea.views += 1;
    await idea.save();

    res.json(idea);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Idea not found' });
    }
    res.status(500).send('Server Error');
  }
};

// Update Idea
const updateIdea = async (req, res) => {
  try {
    let idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    // Check user owns the idea
    if (idea.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to edit this idea' });
    }

    const {
      title,
      description,
      problemStatement,
      category,
      difficultyScore,
      marketPotential,
      visibility,
    } = req.body;

    // Check if new title exists and is not current idea
    if (title && title !== idea.title) {
      const existing = await Idea.findOne({ title });
      if (existing) {
        return res.status(400).json({ message: 'An idea with this title already exists.' });
      }
    }

    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (problemStatement) updateFields.problemStatement = problemStatement;
    if (category) updateFields.category = category;
    if (difficultyScore) updateFields.difficultyScore = difficultyScore;
    if (marketPotential) updateFields.marketPotential = marketPotential;
    if (visibility) updateFields.visibility = visibility;

    idea = await Idea.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    res.json(idea);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Toggle Upvote
const upvoteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    // Check if already upvoted
    const upvoteIndex = idea.upvotes.findIndex(
      (userId) => userId.toString() === req.user.id
    );

    if (upvoteIndex > -1) {
      // Remove upvote
      idea.upvotes.splice(upvoteIndex, 1);
    } else {
      // Add upvote
      idea.upvotes.push(req.user.id);
    }

    await idea.save();
    
    // Return just the new upvotes array or total count for frontend
    res.json({ upvotes: idea.upvotes });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get my ideas
const getMyIdeas = async (req, res) => {
    try {
        const ideas = await Idea.find({ author: req.user.id }).sort({ createdAt: -1 });
        res.json(ideas);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}


module.exports = {
  createIdea,
  getIdeas,
  getIdeaById,
  updateIdea,
  upvoteIdea,
  getMyIdeas
};
