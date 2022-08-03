const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const routes = require('./routes.js');
const HttpError = require('./utils/http-error.js');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

app.use('', routes);

app.use((req, res, next) => {
    return next(
        new HttpError('No routes', 404)
    );
});

// connect to MongoDB using Mongoose and listening to PORT 5000
mongoose
    .connect(`mongodb+srv://Dumb_Programmer:${process.env.MongoDB}@como-estas.frudp.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
        console.log(`Listening to port ${process.env.POR || 5000}`);
        app.listen(process.env.PORT || 5000);
    })
    .catch((err) => {
        console.log('Error', err);
    });