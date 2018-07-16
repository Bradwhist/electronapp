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
server.listen(8080);
io.on('connection', function(socket) {
  console.log('connected to socket')
  socket.emit('connect', {hello: 'world' });
  socket.on('cmd', function (data) {
    console.log(data);
  });
});

var passport = require('passport');
var bcrypt = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(function(user, pass, cb){
  findUser(username, (err, user) => {
    if (err) {
      return done(err)
    }
    if (!user) {
      return done(null, false)
    }
  })
}))

passport.serializeUser(   );
passport.deserializeUser(    );

app.use(passport.initialize());
app.use(passport.session());
