var express = require('express');
var router = express.Router();
var models = require('./../../src/models');

module.exports = function(passport) {
  app.post('/doc', function(req, res) {
    var newDoc = new Doc({
      content: req.body.content,
      owner: {'fix': 'XXXXXXXXXXX'},
      collaboratorList: {},
      title: req.body.title,
      password: req.body.password,
      createdTime: req.body.createdTime,
      lastEditTime: req.body.lastEditTime,

    })
    newDoc.save(function(error, results){
      if (error) {
        console.log("error", error);
      } else {
        res.json(results);
      }
    })
  })

  app.get('/doc/:docId', function(req, res, next) {
    Doc.findById(req.params.docId, function(err, doc) {
      if (err) {
        console.log(err);
        res.send(err);
      } else if (!doc) {
        console.log('no document found');
        res.send('No documents found');
      }
      res.send({
        doc: doc,
      })
    })
  })

  app.get('/user/:userId', function(req, res, next) {
    User.findById(req.params.userId, function(err, user) {
      if (err) {
        console.log(err);
        res.send(err);
      } else if (!doc) {
        console.log('no user found');
        res.send('No user found');
      }
      res.send({
        user: user,
      })
    })
  })
}

//const router = new express.Router();

// router.get('/dashboard', (req, res) => {
//   res.status(200).json({
//     message: "You're authorized to see this secret message.",
//     // user values passed through from auth middleware
//     user: req.user
//   });
// });
