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
        });
    } catch (e) {
        console.error('No se ha podido levantar el servidor:', e);
    }
})();
