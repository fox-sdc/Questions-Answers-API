require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  database: process.env.DB,
  password: process.env.PASS,
  port: process.env.DBPORT,
});

const insertPhotos = (id, photos) => {
  let sPhotos = '[';
  for (let i = 0; i < photos.length - 1; i += 1) {
    sPhotos += `'${photos[i]}'`;
    sPhotos += ',';
  }
  sPhotos += `'${photos[photos.length - 1]}'`;
  sPhotos += ']';
  const text = `
      DO $do$
        DECLARE
          array_urls text[]:= ARRAY ${sPhotos};
          var text;
        BEGIN
          FOREACH var IN ARRAY array_urls
          LOOP
            INSERT INTO Answers_Photos(id_answers, url) VALUES(${id}, var);
          END LOOP;
      END $do$;
    `;
  pool.query(text)
    .catch((err) => {
      console.error(err);
    });
};

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
                        WHERE Answers.id_questions = Questions.question_id
                    )answers
                  )answers
                  FROM Questions
                  WHERE Questions.product_id = $1
                  AND reported = false
                  LIMIT $2
                  OFFSET $3`;
    const offset = page * count;
    const value = [pid, count, offset];
    return pool.query(text, value)
      .catch((err) => {
        console.error(err);
      });
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
                  WHERE Answers.id_questions = $1
                  AND reported = false
                  LIMIT $2
                  OFFSET $3`;
    const offset = page * count;
    const value = [question_id, count, offset];
    return pool.query(text, value)
      .catch((err) => {
        console.error(err);
      });
  },

  postQuestion(body, name, email, product_id, date) {
    const text = `INSERT INTO Questions(product_id, question_body, question_date, asker_name, email, reported, question_helpfulness)
                  VALUES($1, $2, $3, $4, $5, false, 0)`;
    const values = [product_id, body, date, name, email];

    return pool.query(text, values)
      .catch((err) => {
        console.error(err);
      });
  },

  postAnswer(question_id, body, name, email, photos, date) {
    const text = `INSERT INTO Answers(id_questions, body, date, answerer_name, email, reported, helpfulness)
                  VALUES($1, $2, $3, $4, $5, false, 0) RETURNING answer_id`;
    const values = [question_id, body, date, name, email];
    return pool.query(text, values)
      .then((res) => {
        if (photos.length) {
          insertPhotos(res.rows[0].answer_id, photos);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  },

  updateQHelpful(question_id) {
    const text = `UPDATE Questions
                  SET question_helpfulness= question_helpfulness + 1
                  WHERE question_id = $1`;
    const value = [question_id];
    pool.query(text, value)
      .catch((err) => {
        console.error(err);
      });
  },

  reportQuestion(question_id) {
    const text = `UPDATE Questions
                  SET reported = true
                  WHERE question_id = $1`;
    const value = [question_id];
    pool.query(text, value)
      .catch((err) => {
        console.error(err);
      });
  },

  updateAHelpful(answer_id) {
    const text = `UPDATE Answers
                  SET helpfulness= helpfulness + 1
                  WHERE answer_id = $1`;
    const value = [answer_id];
    pool.query(text, value)
      .catch((err) => {
        console.error(err);
      });
  },

  reportAnswer(answer_id) {
    const text = `UPDATE Answers
                  SET reported = true
                  WHERE answer_id = $1`;
    const value = [answer_id];
    pool.query(text, value)
      .catch((err) => {
        console.error(err);
      });
  },
};
