const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend
} = require('../../controllers/user-controller');

// /api/Users
router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

// /api/Users/:id
router
  .route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

router.route('/: UserId/friend/friendId')
  .post(addfriend)
  .delete(deletefriend);

module.exports = router;