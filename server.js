require('dotenv').config();
const app = require('./src/app');
const connectBD = require('./src/config/database');
const http = require('http');

(async () => {
    try {
        await connectBD();
        const server = http.createServer(app);
        const PORT = process.env.PORT || 3005;
        server.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
            console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (e) {
        console.error('No se ha podido levantar el servidor:', e);
    }
})();
