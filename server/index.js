/* eslint-disable quotes */
/* eslint-disable camelcase */
/* eslint-disable no-console */
const express = require('express');
const pg = require('pg');

const app = express();
const port = 3001;

const config = {
  host: 'localhost',
  user: 'gchacon2',
  database: 'qanda',
  password: '',
  port: 5432
};
const pool = new pg.Pool(config); // maybe botttle neck
pool.connect()
  .then(() => console.log('connected to pg'))
  .catch(() => console.log('cannot connect to pg'));

app.use(express.json());
app.use(express.urlencoded()); // maybe unecessary

// look up express best practices

app.get('/qa/:product_id', (req, res) => {
  const { product_id } = req.params;
  const sqlQ = (
    `SELECT product_id,
      coalesce((
        SELECT json_agg(row_to_json(result)) FROM
        (
          SELECT id AS question_id, body AS question_body, date_written AS question_date, asker_name, helpful AS question_helpfulness, reported,
            (SELECT json_object_agg(a.id,
              (SELECT row_to_json(x) FROM
              (SELECT id, body, date_written AS date, answerer_name, helpful AS helpfulness, reported,
                coalesce((SELECT json_agg(row_to_json(photo)) FROM
            (
              SELECT p.id, p.url FROM photos p WHERE p.answer_id = a.id
            ) photo
          ), '[]'
          ) AS Photos FROM answers WHERE id=a.id)x)) FROM answers a, questions q2 WHERE a.question_id = q2.id AND q2.id = q.id)
           AS answers FROM questions q WHERE product_id = ($1)
        ) result
      ), '[]'
      ) AS results FROM questions WHERE product_id = ($1);`
  );
  pool.query(sqlQ, [product_id])
    .then((resultsQ) => (res.send(resultsQ.rows[0])))
    .catch((err) => {
      console.log('FAILED to query get request - check syntax');
      res.send(err);
    });
});

app.get('/qa/:question_id/answers', (req, res) => {
  const { question_id } = req.params;
  const sql = (
    `SELECT id,
      coalesce((
        SELECT json_agg(row_to_json(result)) FROM
        (
          SELECT id AS answer_id, body, date_written AS date, answerer_name, helpful AS helpfulness,
          coalesce((
            SELECT json_agg(row_to_json(photo)) FROM
            (
              SELECT ap.id, ap.url FROM photos ap WHERE ap.answer_id = a.id
            ) photo
          ), '[]'
          ) AS photos FROM answers a WHERE question_id = ($1)
        ) result
      ), '[]'
    ) AS results FROM questions WHERE id = ($1);`
  );
  pool.query(sql, [question_id])
    .then((result) => res.send(result.rows))
    .catch((err) => res.send(err));
});

app.post('/qa/questions', (req, res) => {
  const values = [req.body.product_id, req.body.body,
    req.body.name, req.body.email];
  const sql = (
    `INSERT INTO questions(product_id, body, date_written, asker_name, asker_email, reported, helpful)
     VALUES (($1), ($2), now(), ($3), ($4), false, 0);`
  );
  pool.query(sql, values)
    .then(() => res.sendStatus(201))
    .catch((err) => res.send(err));
});

app.post('/qa/:question_id/answers', (req, res) => {
  const values = [req.params.question_id, req.body.body, req.body.name, req.body.email];
  console.log(values);
  const sql = (
    `INSERT INTO answers(question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
    VALUES (($1), ($2), now(), ($3), ($4), false, 0);`
  );
  pool.query(sql, values)
    .then(() => res.sendStatus(201))
    .catch((err) => res.send(err));
});

app.put('/qa/question/:question_id/helpful', (req, res) => {
  const { question_id } = req.params;
  const sql = `UPDATE questions SET helpful = helpful + 1
  WHERE id = ($1);`;
  pool.query(sql, [question_id])
    .then(() => res.sendStatus(204))
    .catch(() => res.sendStatus(500));
});

app.put('/qa/question/:question_id/report', (req, res) => {
  const { question_id } = req.params;
  const sql = `UPDATE questions SET reported = NOT reported
  WHERE id = ($1);`;
  pool.query(sql, [question_id])
    .then(() => res.sendStatus(204))
    .catch(() => res.sendStatus(500));
});

app.put('/qa/answer/:answer_id/helpful', (req, res) => {
  const { answer_id } = req.params;
  const sql = `UPDATE answers SET helpful = helpful + 1
  WHERE id = ($1);`;
  pool.query(sql, [answer_id])
    .then(() => res.sendStatus(204))
    .catch(() => res.sendStatus(500));
});

app.put('/qa/answer/:answer_id/report', (req, res) => {
  const { answer_id } = req.params;
  const sql = `UPDATE answers SET reported = NOT reported
  WHERE id = ($1);`;
  pool.query(sql, [answer_id])
    .then(() => res.sendStatus(204))
    .catch(() => res.sendStatus(500));
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});