// "use strict";
// var mongoose = require("mongoose");
//
// mongoose.connect(process.env.MONGODB_URI);
//
// var Schema = mongoose.Schema
// var ObjectId = Schema.ObjectId
//
// var UserSchema =  new Schema(
//   {
//     user: {
//       type: String,
//       required: true,
//       index: {unique: true}
//     },
//     // email: {
//     //   type: String,
//     //
//     // },
//     pass: {
//       type: String,
//       required: true,
//     },
//   });
//
//   var DocSchema = new Schema({
//     content: {
//       type: Array,
//       default: []
//     },
//     owner: {
//       type: ObjectId,
//       required: true,
//       ref: "users"
//     },
//     collaboratorList: {
//       type: [{
//         type: ObjectId,
//         ref: "users"
//       }],
//       default: [],
//     },
//     title: {
//       type: String,
//       default: "Untitled"
//     },
//     password: {
//       type: String
//     },
//     createdTime: {
//       type: Date
//     },
//     lastEditTime: {
//       type: Date
//     }
// });
//     // {
//     //   minimize: false
//     // }
//  var Models = {};
//     Models.User = mongoose.model('User', UserSchema);
//     Models.Doc = mongoose.model('Doc', DocSchema);
//
//   module.exports = Models;
