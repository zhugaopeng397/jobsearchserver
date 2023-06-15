require("dotenv").config()
var {createClient} = require('@vercel/postgres');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/jobs', async function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const client = createClient({
    connectionString: process.env.POSTGRES_URL,
  });

  await client.connect();

  try {
    const { rows } = await client.sql`SELECT * FROM job;`;
    res.status(200).json({data:rows});
  } finally {
    await client.end();
  }
});

router.get('/job', async function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const client = createClient({
    connectionString: process.env.POSTGRES_URL,
  });

  await client.connect();

  try {
    console.log(req.query);
    const jobid = req.query.jobid;
    const { rows } = await client.sql`SELECT * FROM jobdescription WHERE jobid=${jobid};`;
    res.status(200).json({data:rows});
  } finally {
    await client.end();
  }
});


module.exports = router;
