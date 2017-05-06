var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var problemSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  success_rate: {
    type: Number,
    default: 0.0,
    required: false
  },
  max_score: {
    type: Number,
    default: 0.0,
    required: false
  },
  difficulty: {
    type: String,
  required: false
  },
  time_limit: {
    type: Number,
    default: 0.0,
    required: false
  },
  rate: {
    type: Number,
    default: 0.0,
    required: false
  },
  theme: {
    type: String,
    required: false
  },
  corte: {
    type: Number,
    required: false
  },
  required_knowledge: {
    type: Number,
    required: false
  }
});

var Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
