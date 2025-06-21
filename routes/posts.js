const router = require('express').Router();
let Post = require('../models/post.model');

// Get all posts
router.route('/').get((req, res) => {
  Post.find()
    .then(posts => res.json(posts))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Create a new post
router.route('/add').post((req, res) => {
  const { title, content, author } = req.body;

  const newPost = new Post({
    title,
    content,
    author,
  });

  newPost.save()
    .then(() => res.json('Post added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;