\c qanda;
CREATE TABLE questions (
  id serial primary key,
  product_id integer,
  body varchar(1000),
  date_written date,
  asker_name varchar(60),
  asker_email varchar(60),
  reported boolean,
  helpful integer
);
CREATE TABLE answers (
  id serial primary key,
  question_id integer references questions(id),
  body varchar(1000),
  date_written date,
  answerer_name varchar(60),
  answerer_email varchar(60),
  reported boolean,
  helpful integer
);
CREATE TABLE photos (
  id serial primary key,
  answer_id integer references answers(id),
  url text
);

-- copy questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
-- FROM '/Users/gchacon2/Desktop/hrsea-15repos/qnaApi/CSV/questions.csv'
-- DELIMITER ','
-- CSV HEADER;

-- copy answers(id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
-- FROM '/Users/gchacon2/Desktop/hrsea-15repos/qnaApi/CSV/answers.csv'
-- DELIMITER ','
-- CSV HEADER;

-- copy photos(id, answer_id, url)
-- FROM '/Users/gchacon2/Desktop/hrsea-15repos/qnaApi/CSV/answers_photos.csv'
-- DELIMITER ','
-- CSV HEADER;



--  TO MAKE A FILE TO UPLOAD TO THE INSTANCE
-- pg_dump dbname=qanda -f qanda.sql

-- TO START AWS INSTANCE
-- ssh -i qandaDB.pem ubuntu@18.224.27.189

-- INSTALL EVERYTHING IN THE AWS SLIDES ON gLEARN

-- CHANGE POSTGRES CONFIG FILES (add host all to pg_hba.config && connection setting on postgresql.conf to listen_addresses '*')
-- sudo nano /etc/postgresql/10/main/pg_hba.conf
-- sudo nano /etc/postgresql/10/main/postgresql.conf

-- TO LOAD DATABASE INTO INSTANCE DATABASE
-- sudo psql -h 18.224.27.189 -p 5432 -U postgres < qanda.sql

-- To access psql in ubuntu use:
-- sudo -i -u postgres
-- psql
