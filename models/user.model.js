const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
   // ADD THIS NEW FIELD
  gc_balance: {
    type: Number,
    required: true,
    default: 1000 // Give every new user 1000 GC to start
  }
},
 {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;