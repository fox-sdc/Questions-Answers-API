

 COPY Questions
 FROM '/Users/kodalpha/Desktop/hackreactor/SDC/CSV/questions.csv'
 DELIMITER ',' CSV HEADER;

 COPY Answers
 FROM '/Users/kodalpha/Desktop/hackreactor/SDC/CSV/answers.csv'
 DELIMITER ',' CSV HEADER;

 COPY Answers_Photos
 FROM '/Users/kodalpha/Desktop/hackreactor/SDC/CSV/answers_photos.csv'
 DELIMITER ',' CSV HEADER;