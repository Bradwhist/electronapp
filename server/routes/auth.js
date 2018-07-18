// Add Passport-related auth routes here.

var express = require('express');
var router = express.Router();
var models = require('./../../src/models');
var passport = require('passport');

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
   failureRedirect: '/login', }));


  // GET Logout page

  router.get('/currentUser', function(req, res) {
    console.log(req.user);
    if (!req.user) {
      res.json(false);
    } else {
      res.json(req.user);
    }
  });

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
