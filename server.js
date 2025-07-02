const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/playlink');

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// A simple test route
app.get('/', (req, res) => {
  res.send('Welcome to the Playlink API!');
});

// API Routers
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const marketplaceRouter = require('./routes/marketplace'); // This line was missing or misplaced
const transactionsRouter = require('./routes/transactions');

app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/marketplace', marketplaceRouter); // Now this line will work
app.use('/transactions', transactionsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});