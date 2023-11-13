const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { User, Book } = require('./dataBase');

router.use(bodyParser.json());

const jwt = require('jsonwebtoken');

// User login
router.post('/login', async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName: userName });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: 'Password does not match' });
    }
    const token = jwt.sign({ userId: user._id }, 'valentina', {
      expiresIn: '1h',
    });
    res.status(200).json({ message: 'Login successful', token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error during login' });
  }
});

 //User Signin
 router.post('/signin', async (req, res) => {
    const { name, lastName, mail, userName, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ userName: userName });
  
      if (existingUser) {
        return res.status(400).json({ message: 'User with the same userName already exists' });
      }
  
      // Create a new user
      const newUser = new User({
        name: name,
        lastName: lastName,
        mail: mail,
        userName: userName,
        password: password,
        books: []
      });
  
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
  
    } catch (error) {
      res.status(500).json({ message: 'Error during registration' });
    }
  });

 //getUserById
 router.get('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const userWithoutPassword = { ...user.toObject() };
      delete userWithoutPassword.password;
  
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user' });
    }
  }); 

  //get all Books of this User
  
  router.get('/users/:userId/books', async (req, res) => {
    try {
      const userId = req.params.userId;
      // Find the user by their ID
      const user = await User.findById(userId).populate('books');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Books associated with the user
      const userBooks = user.books;
      res.json(userBooks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user books' });
    }

  });

module.exports = router;
