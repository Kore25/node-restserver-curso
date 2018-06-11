const express = require('express');
const app = express();
let Categoria = require('../modelos/categoria');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');


//=============================
//Mostarar todas las categorias
//=============================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        //En caso de que se necesite para mas tablas pude duplicarse el populate las veces necesarias
        // .populate('usuario', 'nombre email')
        // .populate('usuario', 'nombre email')
        // .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }



            Categoria.count((err, totalCategorias) => {
                res.json({
                    ok: true,
                    conteo: totalCategorias,
                    categorias
                });
            });

        });
});

//=============================
//Mostarar una categoria
//=============================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let idCategoria = req.params.id;
    Categoria.findById(idCategoria, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria
        });
    });
});

//=============================
//Crear nueva categoria
//=============================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    categoria.save((err, nuevaCategoria) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!nuevaCategoria) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: nuevaCategoria
        });

    });


});


//=============================
//Modificar una categoria
//=============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let modificarCategoria = {
        nombre: body.nombre
    }

    Categoria.findByIdAndUpdate(id, modificarCategoria, { new: true, runValidators: true }, (err, categoriaUpdate) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaUpdate) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'categoria no encontrada'
                }
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaUpdate
        })
    });
});

//=============================
//Eliminar por completo una categoria
//=============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDelete) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDelete
        })
    })

});




module.exports = app;