const { Schema, model } = require('mongoose');

const thoughtSchema = new Schema({

});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;