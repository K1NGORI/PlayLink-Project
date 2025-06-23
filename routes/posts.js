const router = require('express').Router();
let Post = require('../models/post.model');

// GET all posts (now with author's username)
router.route('/').get((req, res) => {
  Post.find()
    .populate('author', 'username') // This will add the username of the author
    .sort({ createdAt: -1 }) // Show newest posts first
    .then(posts => res.json(posts))
    .catch(err => res.status(400).json('Error: ' + err));
});

// ADD a new post
router.route('/add').post((req, res) => {
  const { title, content, author } = req.body;

  if (!title || !content || !author) {
    return res.status(400).json('Error: Please provide title, content, and author ID.');
  }

  const newPost = new Post({ title, content, author });

  newPost.save()
    .then(() => res.json('Post added successfully!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// GET a single post by ID
router.route('/:id').get((req, res) => {
  Post.findById(req.params.id)
    .populate('author', 'username') // Also get the username for the detail view
    .then(post => res.json(post))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;