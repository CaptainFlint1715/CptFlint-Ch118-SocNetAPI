const { ObjectId } = require('mongoose').Types;
const { Thought, User } = require('../models');

module.exports = {
  // get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      const thoughtObj = {
        thoughts,
        headCount: await headCount(),
      };
      return res.json(thoughtObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // get a single thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .lean();

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json({
        thought,
        // grade: await grade(req.params.studentId),
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // delete a thought and remove it from the user
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No such thought exists' })
      }

      const user = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: 'Thought deleted, but no users found',
        });
      }

      res.json({ message: 'Thought successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // update a thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // 'POST' to create a reaction stored in a single thought's 'reactions' array field
  async createReaction(req, res) {
    try {
      const thoughtId = req.params.thoughtId
      const { reactionBody, username } = req.body

      const updatedThought = await Thought.findOneAndUpdate(
        { _id: thoughtId },
        { $push: { reactions: { reactionBody, username } } },
        { new: true }
      )

      if (!updatedThought) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(updatedThought)
    } catch (err) {
      res.status(500).json(err)
    }
  },

  // 'DELETE' to pull and remove a reaction by the reaction's 'reactionId' value
  async deleteReaction(req, res) {
    try {
      const thoughtId = req.params.thoughtId
      const reactionId = req.params.reactionId

      const updatedThought  = await Thought.findOneAndUpdate(
        { _id: thoughtId },
        { $pull: { reactions: { reactionId: reactionId } } },
        { new: true }
      )

      if (!updatedThought) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(updatedThought)
    } catch (err) {
      res.status(500).json(err)
    }
  },

};
