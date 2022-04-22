DROP TABLE IF EXISTS Questions;

CREATE TABLE Questions (
  id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  body VARCHAR(400) NOT NULL,
  date_written BIGINT NOT NULL,
  asker_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  reported BOOLEAN NOT NULL,
  helpful INTEGER NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table 'Answers'
--
-- ---

DROP TABLE IF EXISTS Answers;

CREATE TABLE Answers (
  id INTEGER NOT NULL,
  Questions_id INTEGER NOT NULL,
  body VARCHAR(400) NOT NULL,
  date_written BIGINT NOT NULL,
  answerer_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  reported BOOLEAN NOT NULL,
  helpful INTEGER NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table 'Answers_Photos'
--
-- ---

DROP TABLE IF EXISTS Answers_Photos;

CREATE TABLE Answers_Photos (
  id INTEGER NOT NULL,
  id_Answers INTEGER NOT NULL,
  photo_url VARCHAR(400) NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Foreign Keys
-- ---

ALTER TABLE Answers ADD FOREIGN KEY (Questions_id) REFERENCES Questions (id);
ALTER TABLE Answers_Photos ADD FOREIGN KEY (id_Answers) REFERENCES Answers (id);