const {
  Thought,
  User
} = require('../models');

const thoughtController = {
  //get all thoughts
  // GET /api/thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({
        path: 'reactions',
        select: '-__v',
      })
      .select('-__v')
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.Status(400).json(err);
      })
  },

  // get thoughts by id
  // GET /api/thoughts/:id
  getThoughtById({
    params
  }, res) {
    Thought.findOne({
        _id: params.id
      })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({
            message: 'No user with this id'
          });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(400).json(err);
      });
  },

  // create thoughts of a user
  //POST /api/thoughts
  //"thoughtText": "Hi"
  // "username": "learnatino"
  // "userId": "should be from the corresponding userId of the username"
  createThought({
    body
  }, res) {
    Thought.create(body)
      .then((
        dbThoughtData
      ) => {
        return User.findOneAndUpdate({
          _id: body.userId
        }, {
          $push: {
            thoughts: dbThoughtData._id
          }
        }, {
          new: true
        });
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({
            message: 'No user found with this id!'
          });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // update thought by id
  //PUT /api/thoughts/:id
  //"thoughtText": "Hi"
  // "username": "learnatino"
  // "userId": "learn"

  updateThought({
    params,
    body
  }, res) {
    Thought.findOneAndUpdate({
        _id: params.id
      }, body, {
        new: true
      })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({
            message: 'No thought found with this id!'
          });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  },

  // delete thought
  //DELETE /api/thoughts/:id
  deleteThought({
    params
  }, res) {
    Thought.findOneAndDelete({
        _id: params.id
      })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({
            message: 'No thought found with this id!'
          });
          return;
        }
 // deleting the refernce to the user's thought
       
    User.findOneAndUpdate(
        { username: dbThoughtData.username },
        {$pull: { thoughts: params.id }}
    )
      .then(() => {
          res.json({message: "Deleted the thought"});
      })
      .catch(err => res.status(400).json(err));
  })
    .catch(err => res.status(400).json(err));
},

  // add friends to userId friends list
  // POST /api/thoughts/:thoughtId/reactions

  addReaction({
    params,
    body
  }, res) {
    Thought.findOneAndUpdate({
        _id: params.thoughtId
      }, {
        $addToSet: {
          reactions: body
        }
      }, {
        new: true,
        runValidators: true
      })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({
            message: 'No thought found with this id!'
          });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  },
  // removing reactions from the thought list
  // DELETE /api/thoughts/:id/reactions
  deleteReaction({
    params
  }, res) {
    Thought.findOneAndUpdate({
        _id: params.thoughtId
      }, {
        $pull: {
          reactions: {
            reactionId: params.reactionId
          }
        }
      }, {
        new: true, runValidators: true
      })
  .then((dbThoughtData) => {
  if(!dbThoughtData) {
    res.status(404).json({ message: 'No thought found with this id!' });
    return;
    }
    res.json({message: "Deleted the reaction"});
  })
  .catch(err => res.status(500).json(err))
  },

}

module.exports = thoughtController;