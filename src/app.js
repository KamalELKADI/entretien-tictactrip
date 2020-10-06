const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');

//* Load configuration
require('./config');

//* Init express application
const app = express();

//* Init database connection
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL, {
	useCreateIndex: true,
	useNewUrlParser: true,
	useFindAndModify: true,
	useUnifiedTopology: true
});

//* Setup middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(cookieParser());

//* Setup routes
app.use('/api', require('./routes'));

module.exports = app;
