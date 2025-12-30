const {
    registerUser,
    loginUser
} = require("../services/userManage");
const createUserValidators = require("../validations/userValidator");
const jwt = require("jsonwebtoken");
require('dotenv').config();

if (!process.env.JWT_SECRET) {
    console.error('❌ FATAL: JWT_SECRET no está configurado en variables de entorno');
    process.exit(1);
}

const secretKey = process.env.JWT_SECRET;
const jwtExpire = process.env.JWT_EXPIRE || "1h";

const userController = {
    registerUser: [
        ...createUserValidators,
        async (request, response) => {
            try {
                const { name, mail, pass } = request.body;
                const data = await registerUser(
                    name,
                    mail,
                    pass
                );
                if (data.code === 11000) {
                    const err = new Error("Duplicate key error");
                    err.code = 11000;
                    throw err;
                } else {
                    return response.status(201).json(data);
                }
            } catch (e) {
                if (e.code === 11000) {
                    return response
                        .status(400)
                        .json({ message: "Registro duplicado", code: 11000 });
                }
            }
        },
    ],
    loginUser: [
        async (request, res) => {
            try {
                const { mail, pass } = request.body;

                const data = await loginUser(mail, pass);
                if (!data)
                    return res
                        .status(401)
                        .json({ error: "Credenciales inválidas", code: 401 });
                const token = jwt.sign(
                    { userId: data._id, mailUser: data.mail },
                    secretKey,
                    { expiresIn: jwtExpire }
                );
                const isProduction = process.env.NODE_ENV === "production";

                res.cookie("token", token, {
                    httpOnly: true,
                    secure: isProduction,
                    sameSite: "Strict",
                    maxAge: 3600000,
                    path: "/",
                });
                console.log("Token guardado en cookies");
                return res.status(200).json({
                    status: 200,
                    message: "Login exitoso",
                    user: data.name,
                    photo: data.photoName,
                    rol: data.role,
                });

            } catch (e) {
                console.log("Error al login", e);
                res.status(500).json({ error: "Error interno del servidor" });
            }
        },
    ],
}

module.exports = userController;
