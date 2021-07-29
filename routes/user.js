const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// signing user
router.post('/', async (req, res) => {
  const { login, password, email } = req.body;

  try {
    const ifUser = await User.findOne({ login });
    if (ifUser) throw Error('User already exists');
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      login,
      password: hashedPassword,
      email,
    });
    await user.save();
    res.status(200).json({ message: "You have successfully register" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

// user log in
router.post('/login', async (req, res) => {
  const { login, password } = req.body;
  const user = await User.findOne({ login });
  if (!user) {
    return res.status(400).json({ message: 'Wrong login or password' });
  }
  try {
    if (await bcrypt.compare(password, user.password)) {
      // authentication
      const accessToken = jwt.sign({ userId: user._id, login: user.login }, process.env.ACCESS_TOKEN_SECRET);
      if (!accessToken) throw Error('Couldnt sign the token');
      res.json({
        accessToken,
        login: user.login,
        message: 'success'
      });
    } else {
      res.status(400).json({ message: 'Wrong password' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error, please try again later" }).send();
  }
})

module.exports = router;