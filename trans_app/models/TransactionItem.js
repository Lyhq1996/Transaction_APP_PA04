'use strict';
// require mongoose to create relevant schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// get the objectId for user ref
const ObjectId = mongoose.Schema.Types.ObjectId;

// create schema for model transactionItem
const transactionItemSchema = Schema({
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  userId: { type:ObjectId, ref:'user'}
});
// apply transactionItemSchema to TransactionItem model and export it
module.exports = mongoose.model("TransactionItem", transactionItemSchema);
