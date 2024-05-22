const express = require("express");
const router = express.Router();
const Book = require("../models/book.model");


//Middleware para obtener un libro por ID
const getBook = async (req, res, next) => {
  let book;
  const { id } = req.params;

  if(!id.match(/^[0-9a-fA-F]{24}$/)){
    return res.status(400).json({message: 'ID invalido'});
  }

  try {
    book = await Book.findById(id);
    if(!book){
      return res.status(404).json({message: 'Libro no encontrado'});
    }
  }catch(error){
    return res.status(500).json({message: error.message});
  }

  res.book = book;
  next();
}


// Obtener todos los libros

router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    console.log('GET ALL', books);
    if (books.length === 0) {
      return res.status(204).json({});
    }
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
);

// Crear un nuevo libro (recurso)

router.post('/', async (req, res) => {
  const {
    title,
    author,
    description,
    category,
    price,
  } = req.body;

  if (!title || !author || !description || !category || !price) {
    return res.status(400).json({ message: 'Hay campos faltantes' });
  }

  const book = new Book({
    title,
    author,
    description,
    category,
    price,
  });

  try {
    const newBook = await book.save();
    console.log('POST', newBook);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

});

// Obtener un libro por ID

router.get('/:id', getBook, async(req, res) => {
  res.json(res.book);

})

// Actualizar un libro por ID

router.put('/:id', getBook, async (req, res) => {
  try {
    const book = res.book;
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.description = req.body.description || book.description;
    book.category = req.body.category || book.category;
    book.price = req.body.price || book.price;


    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id', getBook, async (req, res) => {
  if(!req.body.title && !req.body.author && !req.body.description && !req.body.category && !req.body.price){
    return res.status(400).json({message: 'No hay campos para actualizar'});
  }
  
  
  try {
    const book = res.book;
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.description = req.body.description || book.description;
    book.category = req.body.category || book.category;
    book.price = req.body.price || book.price;


    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
);



// Eliminar un libro por ID

router.delete('/:id', getBook, async (req, res) => {
  try {
    const book = res.book;
    await book.deleteOne({
      _id: book._id,
    
    });
    console.log('DELETE', res.book);
    res.json({ message: 'Libro eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;