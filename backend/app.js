const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const routes = require('./router.js');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

app.use('/', routes);

mongoose
    .connect(`mongodb+srv://Dumb_Programmer:${process.env.MongoDB}@como-estas.frudp.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
        console.log(`Listening to port ${process.env.POR || 5000}`);
        app.listen(process.env.PORT || 5000);
    })
    .catch((err) => {
        console.log('Error', err);
    });