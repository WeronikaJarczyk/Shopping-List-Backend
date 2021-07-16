const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// signing user
router.post('/', async (req, res) => {
  console.log(req);
  const { login, password, email } = req.body;

  let user = await User.findOne({ login });
  if (user) return res.status(400).json({ error: 'User already exists' });

  try {
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      login,
      password: hashedPassword,
      email,
    });
    user.save()
      .then(item => {
        res.json({ message: "user send to database" });
      })
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "unable to save to database" });
  }
});

// user log in
router.post('/login', async (req, res) => {
  const { login, password } = req.body;
  const user = await User.findOne({ login });
  if (!user) {
    return res.status(400).json({ error: 'Cannot find user' });
  }
  try {
    if (await bcrypt.compare(password, user.password)) {
      // authentication
      const accessToken = jwt.sign({ userId: user._id, login: user.login }, process.env.ACCESS_TOKEN_SECRET);
      if (!accessToken) throw Error('Couldnt sign the token');
      res.json({
        accessToken,
        login: user.login,
      });
    } else {
      res.status(400).json({ error: 'Wrong Password' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
})

module.exports = router;