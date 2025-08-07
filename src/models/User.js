//AQUI VAN EL SCHEMA DE USUSARIO
const mongose = require('mongoose');
const bcrypt = require('bcrypt');

const ususarioSchema = new mongose.Schema({
    name: { type: String, required: true},
    mail: { type: String, required: true, unique: true },
    pass: { type: String, required: true }
});

ususarioSchema.pre('save', async function (next) {
    try {
        // Solo hashear si la contraseña fue modificada (o es nueva)
        if (!this.isModified('password')) return next();

        // Generar salt y hashear
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);

        // Reemplazar la contraseña en texto plano con el hash
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

ususarioSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const UserRegister = mongose.model('UserRegister', ususarioSchema);

module.exports = UserRegister;