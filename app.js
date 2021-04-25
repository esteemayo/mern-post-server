const express = require('express');

const app = express();

require('./startup/log')(app);
require('./startup/prod')(app);
require('./startup/routes')(app);

module.exports = app;
