require('dotenv').config();
const app = require('./src/app');
const connectBD = require('./src/config/database');
const http = require('http');

console.log('🚀 Iniciando servidor...');
console.log('📦 NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('🔌 PORT:', process.env.PORT || 3005);
console.log('🌐 ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS || 'No configurado');

(async () => {
    try {
        console.log('📡 Conectando a MongoDB...');
        await connectBD();
        
        const server = http.createServer(app);
        const PORT = process.env.PORT || 3005;
        
        server.listen(PORT, '0.0.0.0', () => {
            console.log(`✅ Servidor escuchando en el puerto ${PORT}`);
            console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
            console.log(`⏰ Iniciado a las: ${new Date().toLocaleString()}`);
        });

        server.on('error', (err) => {
            console.error('❌ Error del servidor:', err);
            process.exit(1);
        });

    } catch (e) {
        console.error('❌ No se ha podido levantar el servidor:', e);
        console.error('Stack:', e.stack);
        process.exit(1);
    }
})();
