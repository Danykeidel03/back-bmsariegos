const { default: mongoose } = require('mongoose');
require('dotenv').config();

const connectBD = async () => {
    try{
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('MONGODB_URI no está configurada en variables de entorno');
        }
        await mongoose.connect(mongoURI);
        console.log('Conectado correctamente a MongoDB');
    }catch (e) {
        console.log('Database connection error: ', e);
        process.exit(1);
    }
}

module.exports = connectBD;