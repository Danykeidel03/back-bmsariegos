//AQUI VAN EL SCHEMA DE USUARIO
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = new mongoose.Schema({
    name: { type: String, required: true},
    mail: { type: String, required: true, unique: true },
    pass: { type: String, required: true }
});

usuarioSchema.pre('save', async function (next) {
    try {
        // Solo hashear si la contraseña fue modificada (o es nueva)
        if (!this.isModified('pass')) return next();

        // Generar salt y hashear
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.pass, salt);

        // Reemplazar la contraseña en texto plano con el hash
        this.pass = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

usuarioSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.pass);
};

const UserRegister = mongoose.model('UserRegister', usuarioSchema);

module.exports = UserRegister;