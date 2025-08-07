const {
    registerUser,
    loginUser
} = require("../services/userManage");
const createUserValidators = require("../validations/userValidator");
const jwt = require("jsonwebtoken");
const secretKey = "estoesunaclavesecretaquenadiesabrajamas";

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
                    { expiresIn: "1h" }
                );
                const isProduction = process.env.NODE_ENV === "production";

                res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "None",
                    maxAge: 3600000,
                    path: "/",
                });
                console.log("Cookies metidas");
                return res.status(200).json({
                    status: 200,
                    message: "Login exitoso",
                    user: data.name,
                    photo: data.photoName,
                    rol: data.role,
                });

            } catch (e) {
                console.log("Error al login", e);
                res.status(500).json({ error: "Error interno del servidor" }); // Añadir manejo de error
            }
        },
    ],
}

module.exports = userController;
