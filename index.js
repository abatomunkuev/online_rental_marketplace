const express = require('express');
require('dotenv').config()
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const clientSessions = require('client-sessions');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const userRouter = require('./routers/user');
const roomRouter = require('./routers/room');
mongoose.Promise = require('bluebird');



// Configurations start ------------------------------------
const config = require("./db/config");
const connectionString = config.database_connection_string;

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true });
mongoose.connection.on("open", () => {
    console.log("Database connection open.");
});
mongoose.set('useFindAndModify', false);

// Setup multer ---------------------------
const upload = multer({
    dest: 'img'
})

var app = express();
var port = process.env.PORT || 8080;

// Setting up paths
var publicDirPath = path.join(__dirname, '../public');
var viewsPath = path.join(__dirname, '../views');

// Setup views folder
app.set('views', viewsPath);

// Setup handlebars engine
app.engine('.hbs', exphbs({ 
    extname: '.hbs',
    helpers: {
        convert: function(rooms) {
            if(!rooms) {
                return [];
            }
            return JSON.stringify(rooms);
        },
        increment: function(index) {
            index++;
            return index;
        }
    }
}));
app.set('view engine', '.hbs');

// Setup static directory to serve
app.use(express.static(publicDirPath));
// Setup middleware
app.use(bodyParser.urlencoded({ extended: true })); // before it was true !! check
// Setup sessions
app.use(clientSessions({
    cookieName: "session",
    secret: "sessionsSecret",
    duration: 60*60*1000, // 1 hour
    activeDuration: 1000*60*60 // 1 hour
}));
// Setting up user router
app.use(userRouter);
// Setting up room router
app.use(roomRouter);


// Configuration ends -----------------------------------------



// setup a route to listen for the root folder https://localhost:PORT
app.get('/',(req,res) => {
    //console.log('main');
    //console.log(req.session);
    res.render('home', {
        data:req.session.user,
        layout: false
    });
})

app.get('/forbidden_access', (req,res) => {
    res.render('403',{
        layout: false
    });
})

// setup http server to listen on the port
app.listen(port, () => {
    console.log(`Express http server listing on: ${port}`);
});


// Andrei Batomunkuev

