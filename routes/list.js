const express = require('express');
const router = express.Router();
const List = require('../models/List');
const { authenticateToken } = require('../middleware/authenticate');

// save list
router.post('/save', authenticateToken, async (req, res) => {
  console.log(req.body);
  try {
    const { name, items } = req.body;
    const { userId } = req.user;
    if (!userId) throw Error('User id is required');
    const list = new List({
      userId,
      name,
      items
    });

    const newList = await list.save();

    res.json({ newList });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "unable to save to database" });
  }
});

// edit lists
router.post('/edit', async (req, res) => {
  try {
    const { items, _id } = req.body;

    await List.updateOne({ _id }, { $set: { items } });

    res.json({ items });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "unable to save to database" });
  }
});

// delete lists
router.post('/delete', (req, res) => {
  try {
    const { _id } = req.body;
    List.deleteOne({ _id })
      .then(() => res.json({ message: "Deleted" }));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "unable to save to database" });
  }
});

// display lists
router.get('/', authenticateToken, (req, res) => {
  try {
    const { userId } = req.user;
    List.find({ userId })
      .then((lists) => res.json({ lists }));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "unable to display lists" });
  }
});

module.exports = router;