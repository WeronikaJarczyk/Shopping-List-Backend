const mongoose = require('mongoose');

const ListSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  items: [
    {
      item: String,
      amount: Number,
      unit: String,
      _id: String
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('List', ListSchema);