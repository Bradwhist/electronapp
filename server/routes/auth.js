// Add Passport-related auth routes here.

var express = require('express');
var router = express.Router();
var models = require('./../../src/models');
var passport = require('passport');
var Doc = models.Doc;
var User = models.User;

module.exports = function(passport) {



  // POST registration page
  // var validateReq = function(userData) {
  //   return (userData.password === userData.passwordRepeat);
  // };

  router.post('/signup', function(req, res) {

    var u = new models.User({
      // Note: Calling the email form field 'username' here is intentional,
      //    passport is expecting a form field specifically named 'username'.
      //    There is a way to change the name it expects, but this is fine.
      user: req.body.user,
      pass: req.body.pass,
    });

    u.save(function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).redirect('/register');
        return;
      }
      console.log(user);
      res.json(user);
    });
  });



  // POST Login page
  // router.post('/login', passport.authenticate('local'), function(req, res) {
  //   res.json({'user': req.user});
  // });
  router.post('/login',  passport.authenticate('local', { successRedirect: '/auth/currentUser',
   failureRedirect: '/', }));

   router.get('/currentUser', function(req, res) {
     console.log(req.session);
     if (!req.user) {
       res.json(false);
     } else {
       res.status(200).json({
         user: req.user,

       });
     }
   });

   // GET Logout page
   //////////////////////////////////////////////
   // router.use(function(req, res, next){
   //   if (req.user) {
   //     return next();
   //   } else {
   //     res.json({
   //       loggedIn: false
   //     })
   //   }
   // })
   //////////////////////////////////////////////


  router.get('/test', function(req, res) {
    if (req.user) {
      res.json(req.user);
    } else {
      res.redirect(false);
    }
  })

  // router.post('/doc', function(req, res) {
  //   var currentTime = new Date();
  //   var newDoc = new models.Doc({
  //    content: '',
  //    owner: req.user.id,
  //    collaboratorList: [],
  //    title: 'untitled',
  //    password: '',
  //    createdTime: currentTime,
  //    lastEditTime: currentTime,
  //  })
  //  newDoc.save(function(err, doc) {
  //    if (err) {
  //      console.log(err)
  //    } else {
  //      User.findById(req.user.id).exec()
  //      .then(user => {
  //        user.ownList.push(doc._id);
  //        user.save();
  //      })
  //      .then(user => res.json(doc))
  //      .catch(err => res.send(err))
  //    }
  //  })
  // })
  router.post('/doc', function(req, res) {
    var currentTime = new Date();
    var newDoc = new models.Doc({
     content: '',
     owner: req.user,
     ownerName: req.user.user,
     collaboratorList: [req.user],
     title: req.body.title,
     password: req.body.pass,
     createdTime: currentTime,
     lastEditTime: currentTime,
   })
   newDoc.save()
      .then(response => res.json(newDoc))
      .catch(err => res.send(err))
  })
  //  newDoc.save(function(err, doc) {
  //    if (err) {
  //      console.log(err);
  //      res.status(500).redirect('/register');
  //      return;
  //    }
  //    console.log(doc);
  //    res.json(doc);
  //  });
  // })

  // router.post('/collaborator/', function(req, res) {
  //   Doc.findById(req.body.doc).exec()
  //   .then(doc => {
  //     if (doc.collaboratorList.indexOf(req.body.user) === -1) {
  //     doc.collaboratorList.push(req.body.user);
  //     doc.save();
  //   }
  //   })
  //   .then(response => res.json(doc))
  //   .catch(err => res.send(err))
  // })
  router.post('/collaborator/', function(req, res) {
    Doc.findById(req.body.doc).exec()
    .then(doc => {
      if (doc.collaboratorList.indexOf(req.body.user) === -1) {
      doc.collaboratorList.push(req.body.user);
      doc.save();
      User.findById(req.body.user).exec()
      .then(user => {
        user.docList.push(req.body.doc);
        user.save();
      })
    }
    })
    .then(response => res.json(response))
    .catch(err => res.send(err))
  })

  router.get('/doc', function(req, res) {
    Doc.find().exec()
    .then(docs => res.json(docs))
    .catch(err => res.send(err))
  })

  // router.get('/doc/search/:searchStr', function(req, res) {
  //   Doc.find({title: req.params.searchStr}).exec()
  //   .then(docs => res.json(docs))
  //   .catch(err => res.send(err))
  // })
  router.get('/doc/search/:searchStr', function(req, res) {
    Doc.find().exec()
    .then(docs => {
      var filterFunc = (ele) => {
        return ele.title.toLowerCase().search(req.params.searchStr.toLowerCase()) !== -1;
      }
      docs = docs.filter(filterFunc);
      docs = docs.map(ele => {return {id: ele.id, title: ele.title, ownerName: ele.ownerName, createdTime: ele.createdTime, collaboratorList: ele.collaboratorList}});
      res.json(docs);
    })

    .catch(err => res.send(err))
  })

  router.post('/save', function(req, res) {
    Doc.findById(req.body.doc).exec()
    .then(doc => {
      doc.history.push({content: req.body.content, time: new Date()});
      doc.save();
    })
    .then(response => res.json(doc))
    .catch(err => res.send(err))
  })
  // router.get('/doc/own', function(req, res) {
  //   var retDocs = [];
  //   User.findById(req.user).exec()
  //   .then(user => {
  //     for (var i = 0; i < user.ownList.length; i ++) {
  //       Doc.findById(user.ownList[i].id).exec()
  //       .then(doc => retDocs.push(doc))
  //       .catch(err => console.log(err))
  //     }
  //   })
  //   .then(response => {res.json(retDocs)})
  //   .catch(err => console.log(err))
  // })
  router.get('/doc/own', function(req, res) {
    Doc.find({collaboratorList:{$in:[req.user]}}).exec()
    .then(docs => res.json(docs))
    .catch(err => res.send(err))
  })
  router.get('/user/', function(req, res) {
    User.find().exec()
    .then(users => res.json(users))
    .catch(err => res.send(err))
  })
  //filtered users
  router.get('/user/:user', function(req, res) {
    User.find({user: req.params.user}).exec()
    .then(users => res.json(users))
    .catch(err => res.send(err))
  })
  router.get('/user/id/:userId', function(req, res) {
    User.findById(req.params.userId).exec()
    .then(user => res.json(user.user))
    .catch(err => res.send(err))
  })

  router.get('/doc/:docId', function(req, res) {
    Doc.findById(req.params.docId).exec()
    .then(doc => res.json(doc))
    .catch(err => res.send(err))
  })

  router.get('/logout', function(req, res, next) {
		req.logout();
		req.session.save(function(err)  {
				if (err) {
						return next(err);
				}
				res.status(200).send('OK');
		});
});



  return router;
}
/////
// const express = require('express');
// const validator = require('validator');
// const passport = require('passport');
//
// const router = new express.Router();
//
// /**
//  * Validate the sign up form
//  *
//  * @param {object} payload - the HTTP body message
//  * @returns {object} The result of validation. Object contains a boolean validation result,
//  *                   errors tips, and a global message for the whole form.
//  */
// function validateSignupForm(payload) {
//   const errors = {};
//   let isFormValid = true;
//   let message = '';
//
//   if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
//     isFormValid = false;
//     errors.email = 'Please provide a correct email address.';
//   }
//
//   if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
//     isFormValid = false;
//     errors.password = 'Password must have at least 8 characters.';
//   }
//
//   if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
//     isFormValid = false;
//     errors.name = 'Please provide your name.';
//   }
//
//   if (!isFormValid) {
//     message = 'Check the form for errors.';
//   }
//
//   return {
//     success: isFormValid,
//     message,
//     errors
//   };
// }
//
// /**
//  * Validate the login form
//  *
//  * @param {object} payload - the HTTP body message
//  * @returns {object} The result of validation. Object contains a boolean validation result,
//  *                   errors tips, and a global message for the whole form.
//  */
// function validateLoginForm(payload) {
//   const errors = {};
//   let isFormValid = true;
//   let message = '';
//
//   if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0) {
//     isFormValid = false;
//     errors.email = 'Please provide your email address.';
//   }
//
//   if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
//     isFormValid = false;
//     errors.password = 'Please provide your password.';
//   }
//
//   if (!isFormValid) {
//     message = 'Check the form for errors.';
//   }
//
//   return {
//     success: isFormValid,
//     message,
//     errors
//   };
// }
//
// router.post('/signup', (req, res, next) => {
//   const validationResult = validateSignupForm(req.body);
//   if (!validationResult.success) {
//     return res.status(400).json({
//       success: false,
//       message: validationResult.message,
//       errors: validationResult.errors
//     });
//   }
//
//
//   return passport.authenticate('local-signup', (err) => {
//     if (err) {
//       if (err.name === 'MongoError' && err.code === 11000) {
//         // the 11000 Mongo code is for a duplication email error
//         // the 409 HTTP status code is for conflict error
//         return res.status(409).json({
//           success: false,
//           message: 'Check the form for errors.',
//           errors: {
//             email: 'This email is already taken.'
//           }
//         });
//       }
//
//       return res.status(400).json({
//         success: false,
//         message: 'Could not process the form.'
//       });
//     }
//
//     return res.status(200).json({
//       success: true,
//       message: 'You have successfully signed up! Now you should be able to log in.'
//     });
//   })(req, res, next);
// });
//
// router.post('/login', (req, res, next) => {
//   const validationResult = validateLoginForm(req.body);
//   if (!validationResult.success) {
//     return res.status(400).json({
//       success: false,
//       message: validationResult.message,
//       errors: validationResult.errors
//     });
//   }
//
//
//   return passport.authenticate('local-login', (err, token, userData) => {
//     if (err) {
//       if (err.name === 'IncorrectCredentialsError') {
//         return res.status(400).json({
//           success: false,
//           message: err.message
//         });
//       }
//
//       return res.status(400).json({
//         success: false,
//         message: 'Could not process the form.'
//       });
//     }
//
//
//     return res.json({
//       success: true,
//       message: 'You have successfully logged in!',
//       token,
//       user: userData
//     });
//   })(req, res, next);
// });
