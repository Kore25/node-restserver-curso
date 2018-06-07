const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const Usuario = require('../modelos/usuario');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENTE_ID);


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


//Configuraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENTE_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    // console.log(payload);

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            res.status(403).json({
                ok: false,
                err: e
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, UsuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (UsuarioBD) {
            if (UsuarioBD.google === false) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Debe de usar su autentucación normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    Usuario: UsuarioBD
                }, process.env.SEED = process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: UsuarioBD,
                    token
                })
            }
        } else {
            // si el usuario no existe en la base de datos hay que crearlo 
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, UsuarioBD) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    Usuario: UsuarioBD
                }, process.env.SEED = process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: UsuarioBD,
                    token
                })
            });


        }
    });
    // res.json({
    //     Usuario: googleUser
    // })

});


module.exports = app;