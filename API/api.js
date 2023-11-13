const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./userServer'); 
const bookRoutes = require('./bookServer');

const app = express();
app.use(bodyParser.json());
const PORT = 3000;

app.use(userRoutes);
app.use(bookRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });