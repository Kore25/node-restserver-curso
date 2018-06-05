//Puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//base de datos
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://cafe-user:Fuerza2018@ds145325.mlab.com:45325/cafe';
}

process.env.URL_DB = urlDB;