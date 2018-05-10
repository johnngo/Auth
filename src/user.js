const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/users', { useMongoClient: true });

const UserSchema = new mongoose.Schema({
  // TODO: fill in this schema
  username : {
    type: String,    
    unique: true,
    required: true,
    index: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true
  }

});

UserSchema.pre('save', function(next) {
  console.log('pre save hook');
  bcrypt.hash(this.passwordHash, 12, (err, hash) => {
    if(err) {
      return next(err);
    }

    this.passwordHash = hash;
    return next();
  })
})

UserSchema.methods.isPasswordValid = function(passwordGuess) {
  return bcrypt.compare(passwordGuess, this.passwordHash);
}

module.exports = mongoose.model('User', UserSchema);
