const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
const moment = require('moment');

const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280
    },
    username: { 
        type: String,
        required: true
    },
    
    createdAt: { 
        type: Date,
        default: Date.now,
        get: (createdAtVal) => moment(createdAtVal).format('MM/DD/YYYY [at] hh:mm:a')  
    },
    reactions: [reactionSchema]
}, 
{ 
    toJSON: {
        getters: true
    },
    id: false
});

thoughtSchema.virtual('reactionCount').get(function(){
    return this.reactions.length;
});
const Thought = model('Thought', thoughtSchema);

module.exports = reactionSchema;