require('dotenv').config();
const app = require('./src/app');
const connectBD = require('./src/config/database');

console.log('🚀 Iniciando servidor...');
console.log('📦 NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('🔌 PORT detectado:', process.env.PORT || 'NO CONFIGURADO - usando 3005');
console.log('🌐 ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS || 'No configurado');
console.log('💾 MONGODB_URI:', process.env.MONGODB_URI ? 'Configurado ✅' : 'NO CONFIGURADO ❌');
console.log('🔐 JWT_SECRET:', process.env.JWT_SECRET ? 'Configurado ✅' : 'NO CONFIGURADO ❌');

(async () => {
    try {
        console.log('📡 Conectando a MongoDB...');
        await connectBD();
        
        // Railway asigna dinámicamente el puerto, usar process.env.PORT sin fallback
        const PORT = parseInt(process.env.PORT) || 3005;
        const HOST = '0.0.0.0';
        
        console.log(`🎯 Intentando escuchar en ${HOST}:${PORT}...`);
        
        // Railway necesita que uses app.listen directamente, no http.createServer
        const server = app.listen(PORT, HOST, () => {
            console.log(`✅ Servidor escuchando en ${HOST}:${PORT}`);
            console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
            console.log(`⏰ Iniciado a las: ${new Date().toLocaleString()}`);
            console.log(`🔗 URL: http://${HOST}:${PORT}`);
        });

        server.on('error', (err) => {
            console.error('❌ Error del servidor:', err);
            if (err.code === 'EADDRINUSE') {
                console.error(`Puerto ${PORT} ya está en uso`);
            }
            process.exit(1);
        });

        // Manejo de cierre graceful
        process.on('SIGTERM', () => {
            console.log('🛑 SIGTERM recibido, cerrando servidor...');
            server.close(() => {
                console.log('✅ Servidor cerrado correctamente');
                process.exit(0);
            });
        });

    } catch (e) {
        console.error('❌ No se ha podido levantar el servidor:', e);
        console.error('Stack:', e.stack);
        process.exit(1);
    }
})();
