var mongoose = require("mongoose");



var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId

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

  module.exports = mongoose.model('User', UserSchema);
