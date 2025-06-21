// routes/posts.js
const router = require('express').Router();
let Post = require('../models/post.model');

// ... (the existing '/' GET route is fine)

// --- MODIFIED '/add' route ---
router.route('/add').post((req, res) => {
  const { title, content, author } = req.body; // author is the user's ID

  // Simple validation
  if (!title || !content || !author) {
    return res.status(400).json('Error: Please provide title, content, and author ID.');
  }

  const newPost = new Post({
    title,
    content,
    author,
  });

  newPost.save()
    .then(() => res.json('Post added successfully!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;