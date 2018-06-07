require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));


app.use(require('./rutas/index'));



mongoose.connect(process.env.URL_DB, (err, resp) => {
    if (err) throw err;

    console.log('Base de datos online');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ', 3000);
});