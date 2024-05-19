/*En este aqrchivo definimos el modelo de objeto que contendra la db.
Usamos moongose como modelador para definir el esquema*/
const mongoose = require('mongoose')


//Creamos el objeto(esquema)
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    gender: String,
    publication_date: String
})

//se exporta de esta manera porque es un modelo
module.exports = mongoose.model('Book', bookSchema) //primero el nombre del modelo, segundo el esquema