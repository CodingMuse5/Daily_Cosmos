const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // This will be hashed!
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // For saving images later

  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);