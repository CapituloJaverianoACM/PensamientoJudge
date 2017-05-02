var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var problemSchema = new Schema({
  statement: {
    type: String,
    required: true
  },
  sampleInput: {
    type: String,
    required: true
  },
  sampleOutput: {
    type: String,
    required: true
  },
  testInput: {
    type: [String],
    required: false // TODO - Change to true after testing.
  },
  testOutput: {
    type: [String],
    required: false // TODO - Change to true after testing.
  },
  problemId: {
    type: Number, // TODO - Make it a consecutive.
    required: true
  }
});

var Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
