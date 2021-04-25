const hpp = require('hpp');
const cors = require('cors');
const xss = require('xss-clean');
const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const globalErrorHandler = require('../controllers/errorController');
const AppError = require('../utils/appError');
const postRoute = require('../routes/posts');

module.exports = (app) => {
  // Cors
  app.use(cors());

  // Access-Control-Allow-Origin
  app.options('*', cors());

  // Limit request from some API
  const limiter = rateLimit({
    max: 300,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, Please try again in an hour!',
  });

  app.use('/api', limiter);

  // Express body parser
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // Data sanitization against nosql query injection
  app.use(mongoSanitize());

  // Data sanitize against xss
  app.use(xss());

  // Prevent parameter pollution
  app.use(
    hpp({
      whitelist: ['title', 'body', 'createdAt'],
    })
  );

  // Test middleware
  app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
  });

  app.use('/api/v1/posts', postRoute);

  app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
  });

  app.use(globalErrorHandler);
};
