const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const nokMiddleware = require('./middlewares/nokMiddleware');
const errorMiddleware = require('./middlewares/errorMiddleware');

//Parsear de forma automatica en JSON
app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas peticiones desde esta ip'
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

//toda mi api queda protegida de muchas peticiones recurrentes y excesivas
app.use('/', apiLimiter);

app.use(nokMiddleware)
app.use(errorMiddleware)
module.exports = app;