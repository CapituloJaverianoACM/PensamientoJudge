var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var descriptionSchema = new Schema({
  statement: {
    type: String,
    required: false
  },
  input_format: {
    type: String,
    required: false
  },
  output_format: {
    type: String,
    required: false
  },
  sample_input: {
    type: [String],
    required: false
  },
  sample_output: {
    type: [String],
    required: false
  },
  explanation: {
    type: String,
    required: false
  },
  notes: {
    type: String,
    required: false
  },
  route_test_input: {
    type: String,
    required: false
  },
  route_test_output: {
    type: String,
    required: false
  },
});

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
  },
  description: descriptionSchema
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
{
	"name": "3n+1",
	"max_socore": 21,
	"difficulty": "Easy",
	"time_limit": 1.00,
	"theme": "Easy",
	"corte": 1,
	"required_knowledge": "For loop",
  "description" : {
    "statement" : "3n+1",
    "sample_input" : "1",
    "sample_output": "2",
    "explanation" : "3n+1",
    "notes":"nothing",
    "route_test_input" : "./testCases/testInput/3n+1",
    "route_test_output" : "./testCases/testOutput/3n+1";

  }
}
*/
