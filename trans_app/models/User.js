'use strict';
// require mongoose
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const userSchema = Schema( {
  username:String,
  passphrase: String,
  age: Number,
} );

module.exports = mongoose.model( 'User', userSchema );