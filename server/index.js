const express = require('express');
const pool = require('../Database/db');

const app = express();

app.use(express.json());

// routes for get requests //
// questions
app.get('/qa/questions', async (req, res) => {
  try {
    const { product_id, page, count } = req.query;
    const curQuestions = await pool.query(`SELECT * FROM Questions WHERE product_id = ${product_id}`);
    res.json(curQuestions);
  } catch (err) {
    console.error(err);
  }
});

// answers
app.get('/qa/questions/:question_id/answers', async (req, res) => {
  try {
    const { question_id } = req.params;
    const { page, count } = req.query;
    const curQuestions = await pool.query(`SELECT * FROM Answers, Answers_Photos WHERE Questions_id = ${question_id} AND `
  } catch (err) {
    console.error(err);
  }
});

app.listen(3010, () => {
  console.log('server running on port 3010');
});
