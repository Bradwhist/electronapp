"use strict";
var mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);

var Schema = mongoose.Schema

var UserSchema =  new Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
    },
  });

  var docScheme = new Schema(
    {

    });
