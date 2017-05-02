var mongoose = require('mongoose');
var Schema = mongoose.schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
  name: {
    type: String,
    unique: true,
    require: true
  },
  password: {
    type: String,
    require: true
  }
});

UserSchema.pre('save', function(next)) {
  var user = this;
  if (user.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt
    });

  } else {
    return next();
  }
}
