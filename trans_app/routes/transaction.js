/*
  transaction.js -- Router for the TransactionItem
*/
const express = require('express');
const router = express.Router();
const TransactionItem = require('../models/TransactionItem');
const User = require('../models/User');

/*
get login status and redirect back to login back if not logged in
*/

isLoggedIn = (req, res, next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

// Show all transaction items associated with the current user
router.get('/transaction/', 
  isLoggedIn, 
  async (req, res, next) => {
  let items = [];
  // Show all transactions for the user (sorted by date)
  items = await TransactionItem.find({
    userId: req.user._id
  }).sort({ date: -1 });
  res.render('transactionList', { transactions: items });
});

// Add a new transaction item
router.post('/transaction', isLoggedIn, async (req, res, next) => {
  const transaction = new TransactionItem({
    description: req.body.description,
    amount: req.body.amount,
    category: req.body.category,
    date: new Date(req.body.date),
    userId: req.user._id
  });
  await transaction.save();
  res.redirect('/transaction');
});

// Delete a transaction item for this user
router.get('/transaction/delete/:itemId', isLoggedIn, async (req, res, next) => {
  await TransactionItem.deleteOne({ _id: req.params.itemId });
  res.redirect('/transaction');
});

// Edit a transaction item
router.get('/transaction/edit/:itemId', isLoggedIn, async (req, res, next) => {
  const transaction = await TransactionItem.findById(req.params.itemId);
  res.render('editTransaction', { transaction });
});

router.post('/transaction/updateTransactionItem', isLoggedIn, async (req, res, next) => {
  const { itemId, description, amount, category, date } = req.body;
  await TransactionItem.findOneAndUpdate({ _id: itemId }, { $set: { description, amount, category, date } });
  res.redirect('/transaction');
});

// Summarize transactions by category
router.get('/transaction/byCategory', isLoggedIn, async (req, res, next) => {
  const results = await TransactionItem.aggregate([
    { $match: { userId: req.user._id } },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' }
      }
    },
    { $sort: { total: -1 } }
  ]);
  res.render('groupByCategory', { results });
});

// Sort transactions by any column
router.get('/transaction/sortBy/:columnName', isLoggedIn, async (req, res, next) => {
  const columnName = req.params.columnName;
  let items = [];
  if (columnName === 'amount') {
    items = await TransactionItem.find({
      userId: req.user._id
    }).sort({ amount: -1 });
  } else if (columnName === 'category') {
    items = await TransactionItem.find({
      userId: req.user._id
    }).sort({ category: 1 });
  } else {
    items = await TransactionItem.find({
      userId: req.user._id
    }).sort({ date: -1 });
  }
})

module.exports = router;