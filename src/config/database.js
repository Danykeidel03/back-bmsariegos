const { default: mongoose } = require('mongoose');

const connectBD = async () => {
    try{
        await mongoose.connect('mongodb+srv://danykeidel03:admin1234@cluster0.o2e1ifi.mongodb.net/bmSariegos?retryWrites=true&w=majority&appName=Cluster0');
        console.log('Conectado correctamente');
    }catch (e) {
        console.log('Database connection error: ', e);
        process.exit(1);
    }
}

module.exports = connectBD;