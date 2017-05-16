var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CounterSubmissionSchema = new Schema({
  _id:String,
  sequence_value:Number
});

var  CounterSubmission = mongoose.model('CounterSubmission',CounterSubmissionSchema);

module.exports = CounterSubmission;
