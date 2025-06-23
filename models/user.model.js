// models/user.model.js

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
  gc_balance: {
    type: Number,
    required: true,
    default: 1000 // Gives every new user 1000 GC to start
  },
  avatar: {
    type: String,
    default: 'https://placehold.co/150x150/00ffff/0a0c10?text=P' // A default placeholder avatar
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const User = mongoose.model('User', userSchema);

module.exports = User;