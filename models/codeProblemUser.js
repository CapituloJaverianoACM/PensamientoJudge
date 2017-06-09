var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CodeProblemUserSchema = new Schema({
  code: {
    type: String,
    required : true
  },
  userId: {
    type : Schema.ObjectId ,
    ref : 'User',
    required: true
  },
  problemId: {
    type : Schema.ObjectId ,
    ref : 'Problem',
    required: true
  },
});

var  CodeProblemUser = mongoose.model('CodeProblemUser',CodeProblemUserSchema);

module.exports = CodeProblemUser;
