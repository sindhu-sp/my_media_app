const {
  Schema,
  model,
  Types
} = require('mongoose');
const moment = require('moment');

const reactionSchema = new Schema({
  // set custom id to avoid confusion with parent comment _id
  reactiionId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  reactionBody: {
    type: String,
    required: true,
    maxLength: 280,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (createdAtVal) => moment(createdAtVal).format('MM/DD/YYYY [at] hh:mm:a'),
  },
}, {
  toJSON: {
    getters: true
  },
});

const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 280,
  },
  username: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    get: (createdAtVal) => moment(createdAtVal).format('MM/DD/YYYY [at] hh:mm:a'),
  },
  reactions: [reactionSchema],
}, {
  toJSON: {
    virtuals: true,
    getters: true,
  },
  id: false,
});

thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});
const Thought = model('Thought', thoughtSchema);

module.exports = Thought;