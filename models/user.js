var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var User  = new Schema ({
  username: String,
  passport: String,
  first_name:{
    type: String,
    required: true
  },
  last_name:{
    type: String,
    required: true
  },
  career:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true,
    unique: true
  },
  img: {
    data: Buffer,
    contentType: String
  },
  is_admin:{
    type: Boolean,
    default: false
  }

});


User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',User);

/*
TODO- erase all
{
	"first_name": "Test",
	"last_name": "JAJATEST",
	"career": "ING",
	"user_name": "test",
	"email": "test@test.test",
	"password": "test",
}

*/
