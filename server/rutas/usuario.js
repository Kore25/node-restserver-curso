const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../modelos/usuario');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

app.get('/usuario', verificaToken, (req, res) => {
    // res.json('get Usuario Local');


    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 0;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email rol estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                });
            });

        });

});

app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // usuarioBD.password = null;


        res.json({
            ok: true,
            usuario: usuarioBD
        });

    });


    // if (body.nombre === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es necesario.'
    //     });
    // } else {
    //     res.json({
    //         body
    //     });
    // }
});

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);



    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioModificado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioModificado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioModificado
        });
    });



});

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    // res.json('delete Usuarios');

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };


    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioUpdate) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioUpdate) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioUpdate
        });
    });

    // FUNCION PARA ELIMINAR TOTALMENTE DE LA BASE DE DATOS
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'usuario no encontrado'
    //             }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     })

    // });

});


module.exports = app;