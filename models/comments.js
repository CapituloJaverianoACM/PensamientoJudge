var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var problemSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  problem_name: {
    type: String,
    required: true
  },
  is_reply: {
    type: Boolean,
    default: false,
    required: true
  },
  id_comment_to_reply: {
    type: ObjectId,
    required: false
  },{
    timestamps: true
  }
});

var Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
