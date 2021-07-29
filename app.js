const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv/config');

const app = express();
app.use(bodyParser.json());
app.use(express.json());

// import routes
const listsRoute = require('./routes/list');
const usersRoute = require('./routes/user');

app.use('/lists', listsRoute);
app.use('/users', usersRoute);


//connect to DB
const db = mongoose.connect(process.env.DB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  },
  () => console.log('connected to db')
);

// listening to the port
app.listen(5000);

// for testing
module.exports = app;