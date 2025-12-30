require('dotenv').config();
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'clave_secreta_default';

const verificarToken = (req, res, next) => {
    // 1. Obtener token de las cookies
    const token = req.cookies.token;
    // 2. Si no hay token, denegar acceso
    if (!token) return res.status(401).json({ error: 'Acceso no autorizado' });

    // 3. Verificar token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido o expirado' });
        }
        // 4. Añadir datos del usuario al request
        req.user = decoded;
        next();
    });
};

const verificarRol = (rolesPermitidos) => (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
        return res.status(403).json({ message: 'Sin permiso para acceder a esta accion' })
    }
    next();
};

module.exports = { verificarRol, verificarToken }