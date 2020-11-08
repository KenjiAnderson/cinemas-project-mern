const express = require('express');
const cors = require('cors');
const pino = require('pino');
const expressLogger = require('express-pino-logger');

const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const screenRoutes = require('./routes/screenRoutes');
const showTimingRoutes = require('./routes/showTimingRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
global.logger = logger;

if (['development', 'production'].includes(process.env.NODE_ENV)) {
  app.use(expressLogger({ logger }));
}

// Middlewares
app.use(express.json());

// Implement cors
app.use(cors());

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/movie', movieRoutes);
app.use('/api/v1/screen', screenRoutes);
app.use('/api/v1/show-timing', showTimingRoutes);
app.use('/api/v1/reservation', reservationRoutes);
app.use('/api/v1/checkout', checkoutRoutes);

app.get('/', (req, res) => {
  logger.debug('hi there');
  res.json({
    message: 'it works'
  });
});

// Handle all unhandled routes
app.use('*', (req, res, next) => {
  next(new AppError(`Requested url ${req.originalUrl} doesn't exist`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);
module.exports = app;
