//Puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//base de datos
let urlDB;

//Vencimiento del token
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//Semilla de auntentificación
process.env.SEED = process.env.SEED || 'este-es-el-speed-desarrollo';

// Rol Administrador
process.env.ROL_ADMIN = 'ADMIN_ROLE';





if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URL_DB = urlDB;