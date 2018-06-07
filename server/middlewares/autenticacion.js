const jwt = require('jsonwebtoken');

// Verificar token

let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                error: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.Usuario;
        next();
    })

    // res.json({
    //     token
    // });

}

// Verificar AdminRole

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role != process.env.ROL_ADMIN) {
        return res.status(401).json({
            ok: false,
            error: {
                message: 'El usuario no es administrador'
            }

        });
    }

    // req.usuario = usuarioç
    next();

}


module.exports = {
    verificaToken,
    verificaAdmin_Role
}