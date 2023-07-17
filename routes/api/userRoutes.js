const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser,
  updateUser,
  createFriend,
  deleteFriend,
} = require('../../controllers/userController.js');

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
router
  .route('/:userId')
  .get(getSingleUser)
  .delete(deleteUser)
  .put(updateUser);

router.route('/:userId/friends/:friendId').put(createFriend).delete(deleteFriend);

module.exports = router;
