const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  explanation: { type: String, required: true },
  imageUrl: { type: String, required: true },
  mediaType: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);