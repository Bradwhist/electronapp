"use strict";
var mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);

var Schema = mongoose.Schema

var UserSchema =  new Schema(
  {
    user: {
      type: String,
      required: true,
      index: {unique: true}
    },
    // email: {
    //   type: String,
    //
    // },
    pass: {
      type: String,
      required: true,
    },
  });

  // var docSchema = new Schema(
  //   {
  //     doc: {
  //       owner: String,
  //       contributors: Array,
  //     }
  //
  //   });


  module.exports = mongoose.model('User', UserSchema);
