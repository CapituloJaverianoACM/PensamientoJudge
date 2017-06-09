var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var LogsSchema = new Schema({
  log: String,
  time_stamp: {
    type : Date,
    default: Date.now
  },
});

var  Logs = mongoose.model('Logs',LogsSchema);

module.exports = Logs;
