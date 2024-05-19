// Aca definimos las rutas relacionadas a book
const express = require('express')
const Book = require('../models/book.model')

const router = express.Router() // Router permite crear manejadores de rutas modulares y montables.


// Middleware para buscar un solo libro
const getBook = async(req, res, next)=>{
    let book;
    const {id} = req.params;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).json({
            message: 'El id del libro no es válido'
        })
    }

    try {
        book = await Book.findById(id)
        if(!book){
            return res.status(404).json({
                message: `No se encontro ningún libro con el id: ${id}`
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
    res.book = book //configura en la respuesta el objeto
    next()
}


// Creamos las rutas para cada solicitud HTTP

//Get - obtener todos los libros
router.get('/', async (req, res)=>{
    try {
        const books = await Book.find();
        // find es un metodo propio del objeto mongoose, que busca las instancias, si no se pasa parametro retorna todos
        if(books.length === 0){
            return res.status(204).json([])
        }
        res.json(books)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// Post - Agregar un recurso
router.post('/', async (req, res)=>{
    const {title, author, gender, publication_date} = req?.body
    if(!title || !author || !gender || !publication_date){
        return res.status(400).json({ 
            message: "Los campos título, autor, genero, fecha de publcación, son obligatorios"
        })
    }

    // si viene todos los datos creamos el objeto
    const book = new Book(
        {
            title,
            author,
            gender,
            publication_date
        }
    )

    try {
        const newBook = await book.save()
        res.status(201).json(newBook)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
        
    }
})

// Get individual
router.get('/:id', getBook, async(req, res)=>{ // ruta, middle, callback 
    res.json(res.book);
})

//Put
router.put('/:id', getBook, async(req, res)=>{
    try {
        //traemos el book configurado en el middleware
        const book = res.book;
        console.log('###### put', book);
        //asignamos a las propiedades del book(res) los datos que vienen en la req
        book.title = req.body.title || book.title
        book.author = req.body.author || book.author
        book.gender = req.body.gender || book.gender
        book.publication_date = req.body.publication_date || book.publication_date
        
        //guardamos los cambios
        const bookUpdate = await book.save()

        res.json(bookUpdate)

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

router.patch('/:id', getBook, async(req, res)=>{
    //comprobacion de que al menos se pase una propiedad
    if(!req.body.title && !req.body.author && !req.body.gender && !req.body.publication_date){
        res.status(400).json({
            message: 'Debe pasar el al menos un campo'
        })
    }
    try {
        //traemos el book configurado en el middleware
        const book = res.book;
        console.log('###### patch', book);
        //asignamos a las propiedades del book(res) los datos que vienen en la req
        book.title = req.body.title || book.title
        book.author = req.body.author || book.author
        book.gender = req.body.gender || book.gender
        book.publication_date = req.body.publication_date || book.publication_date
        
        //guardamos los cambios
        const bookUpdate = await book.save()

        res.json(bookUpdate)

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})
 //Delete
router.delete('/:id',getBook, async(req, res)=>{
    try {
        const book = res.book;

        //metodo de mongo para eliminar recibe un objeto como filtro
        await book.deleteOne({
            _id: book._id
        })
        res.json({message:`El libro ${book.title} ha sido eliminado`})
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router