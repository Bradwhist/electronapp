"use strict";
var mongoose = require("mongoose");

var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId

var DocSchema = new Schema({
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
  },
  history: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model('Doc', DocSchema);
