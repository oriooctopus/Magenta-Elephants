const Promise = require('bluebird');
const db = Promise.promisifyAll(require('./models/index'));
const directDb = require('./database/index.js');
const mysql = require('mysql');

var dbConnection;
var tableNames = ['QuestionTags', 'Tags', 'Questions', 'Users'];


var clearDB = function(connection, tablenames) {
  tablenames.forEach(function(tablename) {
    connection.query('DROP TABLE IF EXISTS ' + tablename);
  });
};

dbConnection = mysql.createConnection({
  user: 'root',
  password: '',
  database: '4um'
});
dbConnection.connect(function(err) {
  if (err) {
    return done(err);
  } else {
    clearDB(dbConnection, tableNames);
  }
})

setTimeout(() => {
  db.User.createUser('exampleUser', '', '')
    .then(() => {
      db.Question.createNewQuestion('exampleUser', 'firstQuestion', '', 20, [], 0)
    })
    .then(() => {
      return db.Question.createNewQuestion('exampleUser', 'secondQuestion', '', 20, [], 0);
    })
    .then((question) => {
      var tags = ['react'];
      directDb.Tag.sync()
      .then(() => {
        tags.forEach((tag) => {
          return directDb.Tag.create({
            title: tag
          }).then((createdTag) => {
            directDb.QuestionTag.sync()
            .then(() => {
              directDb.QuestionTag.create({
                QuestionId: question.id,
                TagId: createdTag.id
              })
            })
          })
        });
      });
    });
}, 250);



