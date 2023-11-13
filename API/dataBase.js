const mongoose = require('mongoose');

//connect to db
const dbURI = 'mongodb://127.0.0.1:27017/bookStore';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

  // User Schema
const userSchema = new mongoose.Schema({
    name: String,
    lastName: String,
    mail: String,
    userName: String,
    password: String,
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
  });

  const User = mongoose.model('User', userSchema);
  
  // Book Schema
  const bookSchema = new mongoose.Schema({
    bookName: String,
    author: String,
    genre: String,
    description: String,
    price: Number,
    timeOfPublish: Date,
    imageData: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      }
    },
  });

  const Book = mongoose.model('Book', bookSchema);

/*
  mongoose.connection.close()
  .then(() => {
    console.log('Disconnected from MongoDB');
  })
  .catch((err) => {
    console.error('Error disconnecting from MongoDB:', err);
  });*/

  module.exports = { User, Book };