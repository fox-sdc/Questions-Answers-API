const express = require('express');

const router = express.Router();
const model = require('./model');

// routes for get requests //
// questions
router.get('/qa/questions', async (req, res) => {
  try {
    const { product_id, page = 1, count = 5 } = req.query;
    const currentQ = await model.getQuestions(product_id, page - 1, count);
    const questionQuery = { product_id: product_id, results: currentQ.rows };
    res.status(200).send(questionQuery);
  } catch (err) {
    res.sendStatus(400);
    console.error(err);
  }
});

// answers
router.get('/qa/questions/:question_id/answers', async (req, res) => {
  try {
    const { question_id } = req.params;
    const { page = 1, count = 5 } = req.query;
    const currentA = await model.getAnswers(question_id, page - 1, count);
    const answerQuery = { question: question_id, page: page, count: count, results: currentA.rows }
    res.status(200).send(answerQuery);
  } catch (err) {
    res.sendStatus(400);
    console.error(err);
  }
});

// routes for post requests //
// questions
router.post('/qa/questions', async (req, res) => {
  try {
    const { body, name, email, product_id } = req.body;
    const date = Date.now();
    const quest = await model.postQuestion(body, name, email, product_id, date);
    console.log(quest);
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(400);
    console.error(err);
  }
});

// answers
router.post('/qa/questions/:question_id/answers', async (req, res) => {
  try {
    const { question_id } = req.params;
    const { body, name, email, photos } = req.body;
    console.log(body, name, email, question_id);
    const date = Date.now();
    await model.postAnswer(question_id, body, name, email, photos, date);
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(400);
    console.error(err);
  }
});

// routes for put requests //
// question helpful
router.put('/qa/questions/:question_id/helpful', async (req, res) => {
  try {
    const { question_id } = req.params;
    await model.updateQHelpful(question_id);
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(400);
    console.error(err);
  }
});

// question reported
router.put('/qa/questions/:question_id/report', async (req, res) => {
  try {
    const { question_id } = req.params;
    await model.reportQuestion(question_id);
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(400);
    console.error(err);
  }
});

// answer helpful
router.put('/qa/answers/:answer_id/helpful', async (req, res) => {
  try {
    const { answer_id } = req.params;
    await model.updateAHelpful(answer_id);
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(400);
    console.error(err);
  }
});

// answer report
router.put('/qa/answers/:answer_id/report', async (req, res) => {
  try {
    const { answer_id } = req.params;
    await model.reportAnswer(answer_id);
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(400);
    console.error(err);
  }
});

module.exports = router;
