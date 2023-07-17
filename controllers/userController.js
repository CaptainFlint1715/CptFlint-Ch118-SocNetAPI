const { User, Thought } = require('../models');

module.exports = {
  // get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('thoughts')
        .populate('friends')

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // delete a user
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: 'User and thoughts deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // update a user
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // 'POST' to add a new friend to user's friend list
  async createFriend(req, res) {
    try {
      const userId = req.params.userId
      const friendId = req.params.friendId

      const user = await User.findOneAndUpdate(
        { _id: userId },
        { $push: {friends: friendId } },
        { new: true }
      );
      res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // 'DELETE' to remove a friend from a user's friend list
  async deleteFriend(req, res) {
    try {
      const userId = req.params.userId
      const friendId = req.params.friendId

      const user = await User.findOneAndUpdate(
        { _id: userId, friends: friendId },
        { $pull: { friends:  friendId } },
        { new: true }     
      );

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json({ message: 'Friend deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};


  // 'POST' to create a reaction stored in a single thought's 'reactions' array field
  // async createReaction(req, res) {
  //   try {
  //     const thoughtId = req.params.thoughtId
  //     const { reactionBody, username } = req.body

  //     const updatedThought = await Thought.findOneAndUpdate(
  //       { _id: thoughtId },
  //       { $push: { reactions: { reactionBody, username } } },
  //       { new: true }
  //     )

  //     if (!updatedThought) {
  //       return res.status(404).json({ message: 'No thought with this id!' });
  //     }

  //     res.json(updatedThought)
  //   } catch (err) {
  //     res.status(500).json(err)
  //   }
  // },