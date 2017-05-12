const db = require('../database/index.js');
const question = require('./question.js');

const addTagIfNotExists = function(tag, cb) {
  tag = tag.toLowerCase();
  var counter = 0;
  return db.Tag.findOrCreate({ where: { title: tag } })
  .then((createdTag) => {
    return createdTag[0].dataValues.id;
  });
};

module.exports.addTagItem = function(questionId, tag) {
  addTagIfNotExists(tag)
  .then((tagId) => {
    db.QuestionTag.create({
      QuestionId: questionId,
      TagId: tagId
    });
  })
};

module.exports.getQuestionsFromTag = function(tag, cb) {
  db.Tag.sync()
  .then(() => {
    return db.Tag.findOne({ where: { title: tag } });
  })
  .then((tag) => {
    if (tag) {
      return db.QuestionTag.findAll({
        where: { TagId: tag.id },
        include: db.Question
      })   
    } else {
      throw '';
    }
  })
  .then((result) => {
    var newArr = [];
    for (var i = 0; i < result.length; i++) {
      newArr.push(result[i].dataValues.Question);
    }
    question.formatQuestions(newArr, cb);
  })
  .catch((err) => {
    console.log('there was an error!', err);
    cb([]);
  })
};

