const { User, Thought } = require('../models');

const userController = {
  // get all users
  // GET /api/users/
  getAllUsers(req, res) {
    User.find({})
      .select('-__v')
      .sort({ _id: -1 })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.Status(500).json(err);
      });
  },

  // get one pizza by id
  // GET /api/users/id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate([
        {path: 'thoughts',
        select: '-__v'}, 
        {path: 'friends',
        select: '-__v'}
      ])
      .select('-__v')
      .then(dbUserData => {
          if (!dbUserData) {
              res.status(404).json({message: 'No user with this id'});
              return;
          }
      res.json(dbUserData);
        })
      .catch(err => {
        console.log(err);
        res.sendStatus(400).json(err);
      });
  },

  // createUser
  //POST /api/users
  // "username": "learnatino"
  // "email": "learnatino@leearnatino.com"
  createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(400).json(err));
  },

  // update pizza by id
  //PUT /api/users/:id
  // "username": "learnatino"
  // "email": "learnatino@leearnatino.com"

  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  // delete user
  //DELETE /api/users/:id
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
    }
    // removing user from friends list
    User.updateMany(
        { _id: { $in: dbUserData.friends }},
        {$pull: { friends: params.id }}
    )
  .then(() => {
      Thought.deleteMany({ username: dbUserData.username })
      .then(() => {
          res.json({message: "Deleted the user"});
      })
      .catch(err => res.status(400).json(err));
  })
    .catch(err => res.status(400).json(err));
  })
  .catch(err => res.status(400).json(err));
},

// add friends to userId friends list
// POST /api/users/:userId/friends/:friendId

addFriend({ params }, res) {
User.findOneAndUpdate(
    { _id: params.userId },
    { $addToSet: { friends: params.friendId }},
    { new: true, runValidators: true }
    )
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({ message: 'No user found with this user id!' });
            return;
        }
        // adding the userId to friendId in the friends list
        User.findOneAndUpdate(
            { _id: params.friendId },
            { $addToSet: { friends: params.userId }},
            { new: true, runValidators: true }
        )
            .then(dbUserData1 => {
                if(!dbUserData1) {
                    res.status(404).json({ message: 'No user found with this friend id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err))
        })
        .catch(err => res.json(err))
    },
// removing freinds from the userIds friends list
// DELETE /api/users/: userId/friends/:friendId
deleteFriend({ params }, res) {
    User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId }},
        { new: true, runValidators: true }
    )
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({ message: 'No user found with this user id!' });
            return;
        }
        // removing the userId to friendId in the friends list
        User.findOneAndUpdate(
            { _id: params.friendId },
            { $pull: { friends: params.friendId }},
            { new: true, runValidators: true }
        )
            .then(dbUserData1 => {
                if(!dbUserData1) {
                    res.status(404).json({ message: 'No user found with this friend id!' });
                    return;
                }
                res.json({message: "Deleted the user"});
            })
            .catch(err => res.json(err))
        })
        .catch(err => res.json(err))
    }
    
}


module.exports = userController;