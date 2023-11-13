const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { User, Book } = require('./dataBase');

router.use(bodyParser.json({ limit: '500mb' }));
router.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
const jwt = require('jsonwebtoken');

//getAllBooks
router.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books' });
  }
});

//searchBook
router.get('/search', async (req, res) => {
  const searchQuery = req.query.q; 

  try {
    const searchResults = await Book.find({
      $or: [
        { bookName: { $regex: searchQuery, $options: 'i' } }, 
        { author: { $regex: searchQuery, $options: 'i' } },   
      ],
    });

    res.json(searchResults);
  } catch (error) {
    console.error('Error searching for books:', error);
    res.status(500).json({ error: 'An error occurred while searching for books.' });
  }
});

//get Book by Id
router.get('/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book' });
  }
});
//add new book 
router.post('/books', async (req, res) => {
  try {
    const {
      bookName,
      author,
      genre,
      description,
      price,
      location,
      imageData,
    } = req.body;

    const userId = req.body.userId;
    const parsedPrice = parseFloat(price);

    const newBook = new Book({
      bookName,
      author,
      genre,
      description,
      price: parsedPrice,
      timeOfPublish: new Date(),
      userId,
      imageData: imageData, 
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
      },
    });

    const savedBook = await newBook.save();

    // Update the user's books array with the new book's ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.books.push(savedBook._id);
    await user.save();

    res.status(201).json(savedBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding book' });
  }
});

//edit Book
router.put('/books/:id', async (req, res) => {
  const {
    bookName,
    author,
    genre,
    description,
    price
  } = req.body;

  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
  
    book.bookName = bookName;
    book.author = author;
    book.genre = genre;
    book.description = description;
    book.price = parseFloat(price);

    const updatedBook = await book.save();

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Error editing book' });
  }
});

//delete Book
router.delete('/books/:id', async (req, res) => {
  const bookId = req.params.id;

  try {
    const book = await Book.findByIdAndDelete(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Remove the book's ID from the user's books array
    const user = await User.findByIdAndUpdate(
      book.userId,
      { $pull: { books: bookId } },
      { new: true }
    );

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book' });
  }
});

  module.exports = router;