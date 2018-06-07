const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const Usuario = require('../modelos/usuario');
const jwt = require('jsonwebtoken');


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, UsuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!UsuarioBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }


        if (!bcrypt.compareSync(body.password, UsuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        let token = jwt.sign({
            Usuario: UsuarioBD
        }, process.env.SEED = process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            Usuario: UsuarioBD,
            token
        });

    });
});


module.exports = app;