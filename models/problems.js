var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var problemSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
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
  theme: {
    type: String,
    required: false
  },
  corte: {
    type: Number,
    required: false
  },
  required_knowledge: {
    type: String,
    required: false
  }
});

var Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;

/*
Sample Postman
{
	"name": "3n+1",
	"max_socire": 10,
	"difficulty": "Hard",
	"time_limit": 1.00,
	"theme": "Recursion",
	"corte": 1,
	"required_knowledge": "Basic"
}

{
	"name": "Cacho",
	"max_socire": 21,
	"difficulty": "Medium",
	"time_limit": 1.00,
	"theme": "Loops",
	"corte": 1,
	"required_knowledge": "For loop"
}
*/
