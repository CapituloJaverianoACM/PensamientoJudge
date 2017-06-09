var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var descriptionSchema = new Schema({
  statement: {
    type: String,
    default: "",
    required: false
  },
  input_format: {
    type: String,
    default: "",
    required: false
  },
  output_format: {
    type: String,
    default: "",
    required: false
  },
  samples:{
    type: [[String]],
    required: false,
    default:[[]]
  },
  explanation: {
    type: String,
    default: "",
    required: false
  },
  route_test_input: {
    type: String,
    default: "",
    required: false
  },
  route_test_output: {
    type: String,
    default: "",
    required: false
  },
  testCases : {
    type: [[String]],
    required: false,
    default: [[]]
  }
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
    default: "",
    required: false
  },
  time_limit: {
    type: Number,
    default: 1.0,
    required: false
  },
  theme: {
    type: String,
    default: "",
    required: false
  },
  corte: {
    type: Number,
    default: "",
    required: false
  },
  template: {
    type: String,
    default: '#include <iostream>\n\nusing namespace std;\n\nint main() {\n\treturn 0;\n}',
    required: false
  },
  link_fuente: {
    type: String,
    default: 'https://sophia.javeriana.edu.co/programacion/parciales',
    required: false
  },
  is_original: {
    type: Boolean,
    default: false,
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
