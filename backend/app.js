const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const routes = require('./routes.js');
const HttpError = require('./utils/http-error.js');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

// proxy endpoint for all headers containing CORS (Cross Origin Resource Sharing)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
  });

// connecting to routes
app.use('', routes);

// fall back for routes that don't exist
app.use((req, res, next) => {
    return next(
        new HttpError('No routes', 404)
    );
});

// connect to MongoDB using Mongoose and listening to PORT 5000
mongoose
    .connect(`mongodb+srv://${process.env.MongoDB_user}:${process.env.MongoDB_pass}@${process.env.Cluster}.frudp.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
        console.log(`Listening to port ${process.env.PORT || 5000}`);
        app.listen(process.env.PORT || 5000);
    })
    .catch((err) => {
        console.log('Error', err);
    });