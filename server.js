// import http from 'http';
//
//
//
// http.createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.end('Hello World\n');
// }).listen(1337, '127.0.0.1');
//
// console.log('Server running at http://127.0.0.1:1337/');

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var passport = require('passport');
var express = require('express');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var routes = require('./routes');
var config = require('./config');
var bodyParser = require('express');
var mongoose = require('mongoose');
var User = require('./src/models/models.js')

// mongoose.Promise = global.Promise;
//require('./server/models').connect(config.dbUri);

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json())

app.use(passport.initialize());
app.use(passport.session());

// passport.serializeUser(   );
// passport.deserializeUser(    );

var localSignupStrategy = require('./server/passport/local-signup');
var localLoginStrategy = require('./server/passport/local-login');
passport.use('local-sigup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

var authCheckMiddleware = require('./server/middleware/auth-check');
app.use('/api', authCheckMiddleware);

var authRoutes = require('./server/routes/auth');
var apiRoutes = require('./server/routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.post('/register', function(req, res) {
  console.log(req.body);
  var newUser = new User({
    user: req.body.user,
    pass: req.body.pass,
  });

  newUser.save(function(error, results){
    if (error) {
      console.log("error:", error);
    } else {
      res.json(results);
    }
  })
})

server.listen(8080);
io.on('connection', function(socket) {
  console.log('connected to socket')
  socket.emit('connect', {hello: 'world' });
  socket.on('cmd', function (data) {
    console.log(data);
  });
});

app.set('port', (process.env.Port || 3000));

app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`)
})
