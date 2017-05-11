const Promise = require('bluebird');
const db = Promise.promisifyAll(require('../models/index'));


module.exports = function(req, res, next, body) {
  body = JSON.parse(body);
  return db.User.checkIfUserExists(body.login)
    .then((userid) => {
      if (userid) {
        return userid;
      } else {
        return db.User.createUser(body.login, body.avatar_url, body.bio).id;
      }
    })
    .then((userid) => {
      return db.Session.createSession(userid, req.headers['user-agent']);
    })
    .then((result) => {
      res.cookie('forumNumber', result.cookieNum, { maxAge: 90000, httpOnly: false });
      res.cookie('forumLogin', body.login, {maxAge: 90000 });
      res.redirect('/dashboard');
    })
};