const db = require('../database/index.js');
const tagModel = require('./tag.js');

// FOR UPDATE QUESTION TO WORK THE PROPERTIES NEED TO BE SPECIFIED ON THE CLIENT SIDE THE SAME WAY THE DATA IS IN THE DATABASE. THIS MAKES THE FUNCTION MORE FLEXIBLE BECAUSE YOU CAN PASS IN AS FEW OR AS MANY PROPERTIES AS POSSIBLE

// var exampleObj = {
//   Eid_User: 2,
//   questionTitle: 'this is an example title',
//   questionBody: 'this is an example body'
// };
// updateQuestion(1, exampleObj);

module.exports.updateQuestion = function(questionId, updateObj) {
  return db.Question.sync()
  .then(() => {
    return db.Question.findAll({
      where: { id: questionId }
    })
  })
  .then((data) => {
    return data[0].update(updateObj);
  });
};

// THIS FUNCTION TRANSFERS CURRENCY TO THE EXPERT AND MARKS THE QUESTION AS FINISHED
// WHEN WE IMPLEMENT LIVE CHAT WE WILL BE ABLE TO UPDATE THE EXPERT'S CURRENCY IN REAL TIME, BUT FOR NOW WE CAN'T

module.exports.finishQuestion = function(questionId) {
  var questionPrice;
  db.Question.sync()
  .then(() => {
    return db.Question.findById(questionId);
  })
  .then((question) => {
    if (!question.answered) {
      questionPrice = question.price;
      question.update({
        answered: true
      });
      return question.Eid_User;
    } else {
      throw 'question already answered';
    }
  })
  .then((expertId) => {
    return db.User.findById(expertId);
  })
  .then((expert) => {
    var currentCurrency = expert.currentCurrency;
    return expert.update({
      currentCurrency: currentCurrency + questionPrice
    });
  })
  .catch((err) => {
    console.log('error!', err);
  });
}

// EXAMPLE USAGE OF CREATE NEW QUESTION
// createNewQuestion('heliu', 'is the sky blue?', 'yes it is blue.');

module.exports.createNewQuestion = function(username, title, body, price, tags, minExpertRating) {
  return db.Question.sync()
  .then(() => {
    console.log('this is the username', username);
    return db.User.findAll({
      where: { username: username }
    });
  })
  .then((user) => {
    if (user[0]) {
      return db.Question.create({
        Nid_User: user[0].id,
        questionTitle: title,
        questionBody: body,
        price: price,
        requiredRating: minExpertRating
      });
    } else {
      throw 'user not found';
    }
  })
  .then((question) => {
    tags.forEach((tag) => {
      tagModel.addTagItem(question.dataValues.id, tag);
    });
    return question;
  })
  .catch((err) => {
    console.log('an error occurred!', err);
  });
};

module.exports.formatQuestions = function(questions, cb) {
  var response = [];
  if (questions.length === 0) {
    cb(response);
  } else {
    questions.forEach(question => {
      var questionObj = question.dataValues;
      db.User.findById(question.Nid_User)
        .then(userInfo => {
          questionObj.username = userInfo.username || 'Anonymous';
          questionObj.avatar = userInfo.avatar_url;
          response.push(questionObj);
          if (response.length === questions.length){
            response.sort((a, b) => {
              return b.id - a.id;
            })
            cb(response);  
          }  
        });
    }); 
  }
}

module.exports.getQuestions = function (query, cb) {
  db.Question.sync()
    .then(() => {
      if (query) {
        return db.Question.find({
          where: query
        });
      } else {
        return db.Question.findAll();
      }
    })
    .then(questions => { 
      module.exports.formatQuestions(questions, cb);
    })
    .catch(err => {
      console.error('There was an error!', err);
    });
};





