const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Promise = require('bluebird');
const db = Promise.promisifyAll(require('../models/index'));
const sessionParser = require('../middleware/sessionParser.js');
const request = require('request');
const config = require('../config/vars.js');
const login = require('../middleware/onLogin.js');
const port = process.env.PORT || 3000;
const app = express();

process.env.PWD = process.cwd();
app.use(cookieParser());

var jsonParser = bodyParser.json();
app.use(bodyParser.urlencoded({
  extended: false
}));

app.get('/', function(req, res, next) {
  res.redirect('/dashboard');
});

app.get('/dashboard', sessionParser, function(req, res, next) {
  res.sendFile(process.env.PWD + '/client/index.html');
});

// THIS IS A REDIRECT WHEN THE USER SIGNS IN WITH GITHUB

app.get('/callback', function(req, res, next) { 
  var code = req.query.code;
  var url = `https://github.com/login/oauth/access_token?client_id=${config.clientID}&redirect_uri=http://localhost:3000/callback&client_secret=${config.clientSecret}&code=${code}`;

  request.post(url, function(err, httpResponse, body) {
    var accessToken = body.substring(13);
    var options = {
      url: `https://api.github.com/user?access_token=${accessToken}`,
      headers: {
        'User-Agent': '4um'
      }
    };

    request.get(options, function(err, httpResponse, body) {
      login(req, res, next, body);
    });
  });
});

app.get('/expertRating', function(req, res) {
  db.User.getRating('expert', req.body.username)
  .then((result) => {
    res.end(result);
  });
});

app.get('/noviceRating', function(req, res) {
  db.User.getRating('novice', req.body.username)
  .then((result) => {
    res.end(result);
  })
});

app.get('/questions/*', function(req, res) {
  var slashIndex = req.url.lastIndexOf('/') + 1;
  var tag = req.url.substring(slashIndex).toLowerCase();

  db.Tag.getQuestionsFromTag(tag, questions => res.end(JSON.stringify(questions)));
});

app.get('/questions', function (req, res) {
  db.Question.getQuestions('', arr => res.send(arr));
});

app.post('/questions', jsonParser, function(req, res) {
  req.body.tags = JSON.parse(req.body.tags);
  db.Question.createNewQuestion(req.body.username, req.body.title, req.body.body, Number(req.body.price), req.body.tags, req.body.minExpertRating );
  db.User.updateCurrency(req.body.username, Number(req.body.price));
  res.end();
});

app.put('/questions', function(req, res) {
  var questionId = req.body.questionId;
  delete req.body.questionId;

  db.Question.updateQuestion(questionId, req.body)
  .then((result) => {
    res.end(result);
  });
});

app.use(express.static(process.env.PWD + '/client'));

app.get('/users*', function(req, res) {
  var slashIndex = req.url.lastIndexOf('/') + 1;
  var user = req.url.substring(slashIndex);
  db.User.getUserInfo(user, userInfo => res.end(JSON.stringify(userInfo)));
});

app.get('*', function(req, res) {
  res.redirect('/dashboard');
});


app.listen(port, function() {
  console.log('Listening on port 3000 the dirname is', process.env.PWD + '/../client');
});

// EXAMPLE DATA SENT FOR A POST TO /QUESTIONS
/* {
*    username: 'Oliver',
*    title: 'Why is Oliver so Awesome?',
*    body: 'This is an example body' 
*  }
*/

// EXAMPLE DATA SENT FOR A PUT TO /QUESTIONS
/* {
*    questionId: 2, 
*    expertId: 1,
*    answer: 'this is an example answer'
*  }
*/

// EXAMPLE DATA SENT TO A GET TO /expertRating
/* {
*    userid: 1 
*  }
*/
