const User = require('../models/User');
const bcrypt = require('bcrypt');

async function registerUser(name, mail, pass) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass, salt);

        const user = new User({
            name,
            mail,
            pass: hashedPassword
        });

        const res = await user.save();
        return res;
    } catch (e) {
        return e;
    }
}

async function loginUser(mail, pass) {
    try {
        const user = await User.findOne({ mail: mail });
        if (!user) {
            console.log('Usuario no encontrado');
            return null;
        }

        // Aquí deberías comparar la contraseña
        const isMatch = await bcrypt.compare(pass, user.pass);
        if (!isMatch) {
            console.log('Contraseña incorrecta');
            return null;
        }

        return user;
    } catch (e) {
        console.log('Error:', e);
    }
}


module.exports = { registerUser, loginUser };