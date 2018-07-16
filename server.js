const express = require('express');
const mongoose = require('mongoose');
const bodyParser =require('body-parser');
const app = express();

//---------------
//----- CONFIGS
//---------------
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

    //connecting to our mongoDB
const dbConfig = require('./config/database');

    //setting up our mongoose promises
    //https://scotch.io/tutorials/javascript-promises-for-dummies
mongoose.Promise = global.Promise
    //connecting with mongoose
mongoose.connect(dbConfig.url, { useNewUrlParser: true })
.then(()=>{
    console.log('connected to db');
}).catch(err => {
    console.log('could not connect to db, exiting');
    process.exit();
});

    //calls our index.html file on request to our homepage
app.get('/', (req, res) =>{
    res.sendFile(__dirname + "/index.html");
});

    //calls in our routes file
require('./app/routes')(app);

app.listen(3000,() => {
    console.log('ears open on 3000');
});