const express = require('express');
const app = express();

let Producto = require('../modelos/producto');
let { verificaToken } = require('../middlewares/autenticacion');

//=============================
//Obtener productos
//=============================
app.get('/producto', verificaToken, (req, res) => {
    //traer todos los productos
    //populate: usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);


    Producto.find({ disponible: true })
        .sort('nombre')
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.count((err, total) => {
                res.json({
                    ok: true,
                    productos
                })

            });
        });
});


//=============================
//Obtener un produto por ID 
//=============================
app.get('/producto/:id', verificaToken, (req, res) => {
    //populate: usuario categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto
            })
        });
});


//=============================
//Buscar Productos 
//=============================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        })
});

//=============================
//Crear un nuevo producto 
//=============================
app.post('/producto', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, producto) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto
        })
    })
});

//=============================
//Modificar un producto 
//=============================
app.put('/producto/:id', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado
    let body = req.body;
    let id = req.params.id;

    let modificarProducto = {
        nombre: body.nombre,
        descripcion: body.descripcion,
        precioUni: body.precioUni,
        categoria: body.categoria
    }

    Producto.findByIdAndUpdate(id, modificarProducto, { new: true, runValidators: true }, (err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `El producto ${producto.nombre} no fue encontrado`
                }
            });
        }

        return res.json({
            ok: true,
            message: `El producto ${producto.nombre} fue actualizado`,
            producto
        })
    });

});

//=============================
//Borrar un producto 
//=============================
app.delete('/producto/:id', verificaToken, (req, res) => {
    //eliminar logicamente el producto con el campo disponible = false
    let id = req.params.id;
    let eliminarProducto = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, eliminarProducto, { new: true, runValidators: true }, (err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `El producto ${producto.nombre} no fue encontrado`
                }
            });
        }

        return res.json({
            ok: true,
            message: `El producto ${producto.nombre} eliminado`,
            producto
        })
    });
});

module.exports = app;