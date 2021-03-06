var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session');
var hbs=require('express-handlebars');
var fileUpload=require('express-fileupload'); 
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var productHelpers=require('./helpers/product-helpers');

var  db=require('./config/config');
db.connect((err)=>{
  if(err) console.log(`Connection Error ${{err}}`)
  else console.log(`connection succeed`);
});

var app = express();
var Hbs=hbs.create({});

//register new fuction
Hbs.handlebars.registerHelper('if_eq', function(a, b, opts) {
  if(a == b) // Or === depending on your needs
      return opts.fn(this);
  else
      return opts.inverse(this);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout',partialaDir:__dirname+'/views/partials/'}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())



app.use((req,res,next)=>{
  if(!req.user){
      res.header('cache-control','private,no-cache,no-store,must revalidate')
      res.header('express','-1')
      res.header('paragrm','no-cache')
  }
  next();
});


app.use(session({secret:'Key'/*,cookie:{maxAge: 6000000}*/}))

app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
//for testing
