var createError = require('http-errors');
var express = require('express');
var path = require('path');
require("dotenv").config();
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("./mongoDb");


const cors = require("cors");

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '500mb' }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'build')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(function (req, res, next) {
    next(createError(404));
  });

  const PORT = process.env.PORT || 8080;



//-------------All Routes----------------




app.use(require("./routes/postRoutes"))
app.use(require("./routes/deleteRoutes"))
app.use(require("./routes/getRoutes"))
app.use(require("./routes/updateRoutes"))




app.listen(PORT,()=>console.log(`Server Started at PORT ${PORT}`))


  // error handler
app.use(function (err, req, res, next) {
    // error only in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  
  module.exports = app;
  