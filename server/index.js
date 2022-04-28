const express = require('express');
const cors = require('cors');
const router = require('./controller');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(router);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

module.exports = app;
