// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
// Make sure you have MongoDB installed and running on your local machine
mongoose.connect('mongodb://localhost:27017/playlink', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// A simple test route
app.get('/', (req, res) => {
  res.send('Welcome to the Playlink API!');
});
// server.js (add these lines)

const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const marketplaceRouter = require('./routes/marketplaces');

app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/marketplace', marketplaceRouter);
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});