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
    docList: {
      type: Array,
      default: []
    }
  });

  var docScheme = new Schema({
    content: {
      type: Array,
      default: []
    },
    owner: {
      type: ObjectId,
      required: true,
      ref: "users"
    },
    collaboratorList: {
      type: [{
        type: ObjectId,
        ref: "users"
      }],
      default: [],
    },
    title: {
      type: String,
      default: "Untitled"
    },
    password: {
      type: String
    },
    createdTime: {
      type: Date
    },
    lastEditTime: {
      type: Date
    }
},
    {
      minimize: false
    }
    });

  // module.exports = mongoose.model('documents', Document);
  module.exports = mongoose.model('User', UserSchema);
