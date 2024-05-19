const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser') 
const { config } = require('dotenv')
const bookRoutes = require('./routes/book.routes')

/* El método config de dotenv se encarga de cargar automáticamente las variables de entorno del archivo .env 
cuando tu aplicación se inicia. Esto te permite acceder a ellas en cualquier parte de tu código Node.js 
utilizando process.env.*/
config()

/* creamos instancia de Express, puedes utilizar el objeto app para configurar rutas, middleware, 
definir comportamientos para diferentes tipos de solicitudes HTTP. Es el punto central de tu aplicación Express, 
desde donde puedes manejar todas las operaciones relacionadas con la aplicación web */
const app = express()
app.use(bodyParser.json()) //Parseador de bodies

//Conexión a la base de datos
mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME})
const db = mongoose.connection;

// definimos la ruta principal y todas las rutas asociadas.
// Si tuvieramos diferentes categorias, por ejemplo books, author, gender, se define un use por cada grupo.
app.use('/books', bookRoutes)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Servidor iniciado en puerto ${port}`);
})