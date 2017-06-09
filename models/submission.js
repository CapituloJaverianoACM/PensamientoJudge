var mongoose = require('mongoose');
var Schema = mongoose.Schema;




var SubmissionSchema = new Schema({
  //create counter in databases
  _id:{
    type: Number,
    required: true,
    unique: true
  },
  source_code: {
    type: String,
    required: true
  },
  veredict: {
    type: String,
    required: true,
    enum:['Queue','Accepted','Wrong Answer','Time limit','Run Time Error','Compilation Error'],
    default: 'Queue'
  },
  score: {
    type: Number,
    default: 0.0
  },
  time_stamp: {
    type : Date,
    default: Date.now
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

var Submission = mongoose.model('Submission',SubmissionSchema);

module.exports = Submission;


/*
{
"source_code": "",
"userId" : "591136a3e67e1b6f6edceda1",
"problemId" : "59112c6cb6e511838429c7ba"
}

*/
