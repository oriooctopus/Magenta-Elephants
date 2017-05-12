const expect = require('chai').expect;
const chai = require('chai');
const Promise = require('bluebird');
const httpMocks = require('node-mocks-http');
const chaiHttp = require('chai-http');
const Sequelize = require('sequelize');
const request = require('request');
const login = Promise.promisifyAll(require('../middleware/onLogin.js'));
const db = require('../models/index');
const directDb = require('../database/index');
const mysql = require('mysql');

chai.use(chaiHttp);
const agent = chai.request.agent('http://localhost:3000');

var questionArray = [{
  username: 'exampleUser',
  title: 'this is an example title',
  body: 'this is an example body',
  price: 20
},
{
  username: 'exampleUser',
  title: 'this is an example title',
  body: 'this is an example body',
  price: 20
},
{
  username: 'exampleUser2',
  title: 'this is an example title',
  body: 'this is an example body',
  price: 20
},
{
  username: 'exampleUser2',
  title: 'this is an example title',
  body: 'this is an example body',
  price: 20
}];


var clearDB = function(connection, tablenames, done) {
  var count = 0;
  tablenames.forEach(function(tablename) {
    connection.query('DROP TABLE IF EXISTS ' + tablename, function() {
      count++;
      if (count === tablenames.length) {
        console.log(123);
        return done();
      }
    })
  })
};



describe('Successfully authenticating through github', function() {
  var dbConnection;
  var tableNames = ['QuestionTags', 'Tags', 'Sessions', 'Users', 'Questions', 'Session'];
  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
      user: 'root',
      password: '',
      database: '4um'
    });
    dbConnection.connect(function(err) {
      if (err) {
        return done(err);
      } else {
        clearDB(dbConnection, tableNames, done);
      }
    });
  })

  it('creates a new user record', function(done) {
    var dummyUser = 'exampleUser';
    var dummyBody = JSON.stringify({
      login: dummyUser,
      avatar_url: 'http://fake-example-url'
    });

    var request = httpMocks.createRequest({
      method: 'GET',
      headers: {
        'user-agent': 'example-user-agent'
      }
    });

    var response = httpMocks.createResponse();

    login(request, response, () => {}, dummyBody)
      .then(() => {
        db.User.checkIfUserExists(dummyUser)
        .then((data) => {
          expect(data).to.be.an('number');
          done();
        })
      });
  });

  it('does not create a new user record if one already exists', function(done) {
    var dummyUser = 'exampleUser';
    var dummyBody = JSON.stringify({
      login: dummyUser,
      avatar_url: 'http://fake-example-url'
    });

    var request = httpMocks.createRequest({
      method: 'GET',
      headers: {
        'user-agent': 'example-user-agent'
      }
    });

    var response = httpMocks.createResponse();

    login(request, response, () => {}, dummyBody)
    .then(() => {
      login(request, response, () => {}, dummyBody)
      .then(() => {
        directDb.User.sync()
          .then(() => {
            return directDb.User.findAll(); 
          })
          .then((data) => {
            expect(data.length).to.equal(1);
            done();
          })
      })
    });
  });

  it('attaches a cookie that is stored in the sessions database', function(done) {
    var dummyUser = 'exampleUser';
    var dummyBody = JSON.stringify({
      login: dummyUser,
      avatar_url: 'http://fake-example-url'
    });

    var request = httpMocks.createRequest({
      method: 'GET',
      headers: {
        'user-agent': 'example-user-agent'
      }
    });

    var response = httpMocks.createResponse();

    login(request, response, () => {}, dummyBody)
      .then(() => {
        var cookieVal = response.cookies.forumNumber.value;
        done();
      });
  });

});

describe('authentication', function() {
  it('redirects to /callback when no cookies are attached', function(done) {
    chai.request('http://localhost:3000/dashboard').
      get('/').
      end((err, res) => {
        expect(res).to.redirect;
        done();
      });
  })

  it('does not redirect when valid cookies are attached', function(done) {
    directDb.Session.sync()
      .then(() => {
        return db.Session.createSession(1, '4um'); 
      })
      .then((result) => {
        chai.request('http://localhost:3000/dashboard').
          get('/').
          set('Cookie', `forumNumber=${result.cookieNum}`).
          set('user-agent', '4um').
          end((err, res) => { 
            expect(res).to.not.redirect;
            done();
          });
      })

  });
});

describe('questions: ', function() {
  var dbConnection;
  var tableNames = ['QuestionTags', 'Tags', 'Sessions', 'Users', 'Questions'];
  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
      user: 'root',
      password: '',
      database: '4um'
    });
    dbConnection.connect(function(err) {
      if (err) {
        return done(err);
      } else {
        clearDB(dbConnection, tableNames, done);
      }
    });
  })

  it('a post to questions creates a new question', function(done) {
    var dummyUser = 'exampleUser';
    var dummyBody = JSON.stringify({
      login: dummyUser,
      avatar_url: 'http://fake-example-url'
    });

    var request = httpMocks.createRequest({
      method: 'GET',
      headers: {
        'user-agent': 'example-user-agent'
      }
    });

    var response = httpMocks.createResponse();
    // All of this including login creates a user
    login(request, response, () => {}, dummyBody)
      .then(() => {
        var exampleObj = {
          username: 'exampleUser',
          title: 'this is an example title',
          body: 'this is an example body',
          tags: '[]',
          price: 20
        };

        chai.request('http://localhost:3000/questions').
          post('/').
          send(exampleObj).
          end((err, res) => { 
            setTimeout(function() {
              // gives time for question to be inserted into db
              directDb.Question.sync()
                .then(() => {
                  db.Question.getQuestions('', (response) => {
                    expect(response.length).to.equal(1);
                    done();
                  })
                });
            }, 500)
          });
      });
  });
});

describe('users: ', function() {
  var dbConnection;
  var tableNames = ['Sessions', 'Questions', 'Users'];
  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
      user: 'root',
      password: '',
      database: '4um'
    });
    dbConnection.connect(function(err) {
      if (err) {
        return done(err);
      } else {
        clearDB(dbConnection, tableNames, done);
      }
    });
  });

  it('a user starts off with 100 points', function(done) {
    db.User.createUser('exampleUser', '', '')
      .then(() => {
        db.User.getUserInfo('exampleUser', (userInfo) => {
          expect(userInfo.currentCurrency).to.equal(100);
          expect(userInfo.totalCurrency).to.equal(100);
          done();
        }); 
      });
  });

  it('update currency updates a users currentCurrency and totalCurrency when the value is positive', function(done) {
    db.User.createUser('exampleUser', '')
      .then(() => {
        return db.User.updateCurrency('exampleUser', 30);
      })
      .then(() => {
        db.User.getUserInfo('exampleUser', (userInfo) => {
          expect(userInfo.currentCurrency).to.equal(130);
          expect(userInfo.totalCurrency).to.equal(130);
          done();
        });
      });
  });

  it('update currency updates a users currentCurrency and totalCurrency when the value is positive', function(done) {
    db.User.createUser('exampleUser', '')
      .then(() => {
        return db.User.updateCurrency('exampleUser', -50);
      })
      .then(() => {
        db.User.getUserInfo('exampleUser', (userInfo) => {
          expect(userInfo.currentCurrency).to.equal(50);
          expect(userInfo.totalCurrency).to.equal(100);
          done();
        });
      });
  });
});

