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
var LocalStrategy = require('passport-local').Strategy;
var express = require('express');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var routes = require('./routes');
var config = require('./config');
var bodyParser = require('express');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
var Models = require('./src/models');
var authRoutes = require('./server/routes/auth.js');
var apiRoutes = require('./server/routes/api.js');
var User = Models.User;
var Doc = Models.Doc;

// mongoose.Promise = global.Promise;
//require('./server/models').connect(config.dbUri);

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json())

app.use(passport.initialize());
app.use(passport.session());

// Passport Serialize
passport.serializeUser(function(user, done){
  done(null, user._id);
});
// Passport Deserialize

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Passport Strategy
passport.use(new LocalStrategy({
  usernameField: 'user',
  passwordField: 'pass',
},
  function (username, password, done) {
  // find the user with the given email
Models.User.findOne({user: username}, function(err, user) {
  // if there's an error, finish trying to authenticate (auth failed)
    if (err) {
      console.log(err);
      return done(err);
    }

    // if no user present, auth failed
    if (!user) {
      console.log('no user found');
      return done(null, false, {message: 'Incorrect email'});
    }

    // if passwords do not match auth failed
    if (user.pass !== password) {
      return done(null, false, { message: 'Incorrect password'});
    }

    // auth has succeeded
    return done(null, user);
  });
}));

app.use('/auth', authRoutes(passport));
app.use('/api', apiRoutes);

// app.post('/doc', function(req, res) {
//   var newDoc = new Doc({
//     content: req.body.content,
//     owner: {'fix': 'XXXXXXXXXXX'},
//     collaboratorList: {},
//     title: req.body.title,
//     password: req.body.password,
//     createdTime: req.body.createdTime,
//     lastEditTime: req.body.lastEditTime,
//
//   })
//   newDoc.save(function(error, results){
//     if (error) {
//       console.log("error", error);
//     } else {
//       res.json(results);
//     }
//   })
// })

// app.get('/doc/:docId', function(req, res, next) {
//   Doc.findById(req.params.docId, function(err, doc) {
//     if (err) {
//       console.log(err);
//       res.send(err);
//     } else if (!doc) {
//       console.log('no document found');
//       res.send('No documents found');
//     }
//     res.send({
//       doc: doc,
//     })
//   })
// })
//
// app.get('/user/:userId', function(req, res, next) {
//   User.findById(req.params.userId, function(err, user) {
//     if (err) {
//       console.log(err);
//       res.send(err);
//     } else if (!doc) {
//       console.log('no user found');
//       res.send('No user found');
//     }
//     res.send({
//       user: user,
//     })
//   })
// })



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
