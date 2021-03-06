DROP TABLE IF EXISTS Questions;

CREATE TABLE Questions (
  question_id BIGSERIAL NOT NULL,
  product_id INTEGER NOT NULL,
  question_body VARCHAR(400) NOT NULL,
  question_date BIGINT NOT NULL,
  asker_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  reported BOOLEAN NOT NULL,
  question_helpfulness INTEGER NOT NULL,
  PRIMARY KEY (question_id)
);

-- ---
-- Table 'Answers'
--
-- ---

DROP TABLE IF EXISTS Answers;

CREATE TABLE Answers (
  answer_id BIGSERIAL NOT NULL,
  id_questions INTEGER NOT NULL,
  body VARCHAR(400) NOT NULL,
  date BIGINT NOT NULL,
  answerer_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  reported BOOLEAN NOT NULL,
  helpfulness INTEGER NOT NULL,
  PRIMARY KEY (answer_id)
);

-- ---
-- Table 'Answers_Photos'
--
-- ---

DROP TABLE IF EXISTS Answers_Photos;

CREATE TABLE Answers_Photos (
  id BIGSERIAL NOT NULL,
  id_answers INTEGER NOT NULL,
  url VARCHAR(400) NOT NULL DEFAULT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Foreign Keys
-- ---
ALTER TABLE Answers ADD FOREIGN KEY (id_questions) REFERENCES Questions (question_id);
ALTER TABLE Answers_Photos ADD FOREIGN KEY (id_answers) REFERENCES Answers (answer_id);