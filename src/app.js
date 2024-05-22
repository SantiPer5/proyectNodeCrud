const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { config } = require('dotenv');
config();

const bookRoutes = require('./routes/book.route');

//usamos express apra los metodos http
const app = express();
app.use(bodyParser.json()); //Parseador de bodys

//Aca conectamos la bdd:
mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME})
const db = mongoose.connection;

app.use('/books', bookRoutes);


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening http://localhost:${port}`);
});
