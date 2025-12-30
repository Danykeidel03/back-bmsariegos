const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const nokMiddleware = require('./middlewares/nokMiddleware');
const errorMiddleware = require('./middlewares/errorMiddleware');

// Trust proxy for Railway deployment
app.set('trust proxy', 1);

// Configurar CORS con orígenes específicos
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',').map(o => o.trim());

console.log('🌐 Orígenes CORS permitidos:', allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir requests sin origin (como Postman, mobile apps, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        console.log(`✅ CORS permitido para: ${origin}`);
        callback(null, true);
      } else {
        console.warn(`🚫 CORS bloqueado para origen: ${origin}`);
        console.warn(`📋 Orígenes permitidos:`, allowedOrigins);
        // Permitir de todas formas para debug - luego quitar esto
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-api-key'],
    exposedHeaders: ['set-cookie'],
    optionsSuccessStatus: 200
  })
);

//Parsear de forma automatica en JSON
app.use(express.json());
app.use(cookieParser());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting - APLICAR ANTES DE LAS RUTAS
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas peticiones desde esta ip'
});
app.use('/', apiLimiter);

// Health check endpoint (sin rate limit ni auth)
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'BM Sariegos API funcionando',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

/**
 * LLAMADA RUTAS
 */

const birthdayManage = require('./routes/birthdayManage')
app.use('/birthday', birthdayManage)

const userManage = require('./routes/userManage')
app.use('/user', userManage)

const noticeManage = require('./routes/noticeManage')
app.use('/notice', noticeManage)

const sponsorManage = require('./routes/sponsorManage')
app.use('/sponsor', sponsorManage)

const rivalTeamManage = require('./routes/rivalTeamManage')
app.use('/rival-team', rivalTeamManage)

const teamManage = require('./routes/teamManage')
app.use('/team', teamManage)

const matchManage = require('./routes/matchManage')
app.use('/match', matchManage)

const imagenCabeceraManage = require('./routes/imagenCabeceraManage')
app.use('/imagenes-cabecera', imagenCabeceraManage)

const clasificacionManage = require('./routes/clasificacionManage')
app.use('/api', clasificacionManage)

const setupManage = require('./routes/setupManage')
app.use('/setup', setupManage)

app.use(nokMiddleware)
app.use(errorMiddleware)
module.exports = app;