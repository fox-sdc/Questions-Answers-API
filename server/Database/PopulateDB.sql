

 COPY Questions
 FROM '/Users/kodalpha/Desktop/hackreactor/SDC/CSV/questions.csv'
 DELIMITER ',' CSV HEADER;

 COPY Answers
 FROM '/Users/kodalpha/Desktop/hackreactor/SDC/CSV/answers.csv'
 DELIMITER ',' CSV HEADER;

 COPY Answers_Photos
 FROM '/Users/kodalpha/Desktop/hackreactor/SDC/CSV/answers_photos.csv'
 DELIMITER ',' CSV HEADER;


SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"questions"', 'question_id')), (SELECT (MAX("question_id") + 1) FROM "questions"), FALSE);
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"answers"', 'answer_id')), (SELECT (MAX("answer_id") + 1) FROM "answers"), FALSE);
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"answers_photos"', 'id')), (SELECT (MAX("id") + 1) FROM "answers_photos"), FALSE);
