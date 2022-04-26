require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.USER,
  database: process.env.DB,
  port: process.env.DBPORT,
});
const buildQuery = (text, values) => {
  const query = {};
  query.text = text;
  query.values = values;
  return query;
};

// const text = `SELECT * FROM Questions WHERE product_id = ${product_id}`;
// pool.query(buildQuery(text, [page, count]))
//   .then((res) => {
//     return res.rows;
//   });
module.exports = {
  getQuestions(pid, page, count) {
    const text = `SELECT question_id,
                  question_body,
                  DATE_TRUNC('day', to_timestamp(cast(question_date/1000 as bigint))::date) AS question_date,
                  asker_name,
                  question_helpfulness,
                  reported,
                  (SELECT COALESCE(Answers, '{}'::JSON)
                  FROM (SELECT
                        JSON_OBJECT_AGG(
                          Answers.answer_id,
                          JSON_BUILD_OBJECT(
                            'id', Answers.answer_id,
                            'body', Answers.body,
                            'date', DATE_TRUNC('day', to_timestamp(cast(Answers.date/1000 as bigint))::date),
                            'answerer_name', Answers.answerer_name,
                            'helpfulness', Answers.helpfulness,
                            'reported', Answers.reported,
                            'photos', CASE WHEN EXISTS (SELECT 1 FROM Answers_Photos WHERE Answers.answer_id = Answers_Photos.id_Answers) THEN JSON_BUILD_ARRAY(
                              JSON_BUILD_OBJECT(
                              'id', Answers_Photos.id,
                              'url', Answers_Photos.url
                            )
                            )
                            ELSE '[]'
                            END
                           )
                        ) answers
                        FROM Answers
                        LEFT JOIN Answers_Photos
                        ON Answers.answer_id = Answers_Photos.id_Answers
                        WHERE Answers.Questions_id = Questions.question_id
                    )answers
                  )answers
                  FROM Questions
                  WHERE Questions.product_id = ${pid}`;
    return pool.query(text);
  },

  getAnswers(question_id, page, count) {
    const text = `SELECT Answers.answer_id,
                  Answers.body,
                  DATE_TRUNC('day', to_timestamp(cast(Answers.date/1000 as bigint))::date),
                  Answers.answerer_name,
                  Answers.helpfulness,
                  ( CASE WHEN EXISTS (SELECT 1 FROM Answers_Photos WHERE Answers.answer_id = Answers_Photos.id_Answers) THEN JSON_BUILD_ARRAY(
                    JSON_BUILD_OBJECT(
                    'id', Answers_Photos.id,
                    'url', Answers_Photos.url
                  )
                  )
                  ELSE '[]'
                  END) as photos
                  FROM Answers
                  LEFT JOIN Answers_Photos
                  ON Answers.answer_id = Answers_Photos.id_Answers
                  WHERE Answers.Questions_id = ${question_id}`;
    return pool.query(text);
  },

  postQuestion(product_id, body, name, email) {

  },

  postQuestion(question_id, body, name, email, photos) {

  },

  updateQHelpful(question_id) {

  },

  reportQuestion(question_id) {

  },

  updateAHelpful(answer_id) {

  },

  reportAnswer(answer_id) {

  },

};
// pool.query(`SELECT * FROM Questions WHERE product_id = ${product_id}`)
// pool.query(`SELECT * FROM Answers a, Answers_Photos p WHERE a.Questions_id = ${question_id} AND p.id_Answers = a.id`);
