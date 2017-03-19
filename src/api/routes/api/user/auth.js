const router = require('express-promise-router')();
const Token = require('../../../model/token');
const User = require('../../../model/user');

/* LOG IN */
router.post('/', (req, res) =>
  User.login(req.body.username, req.body.password)
  .then((token) => res.json({ accessToken: token, status: 200 }))
);

/* LOG OUT */
router.delete('/', (req, res) =>
  User.logout(req.body.accessToken)
  .then(() => {
    res.clearCookie('accessToken');
    res.end();
  })
);

/* CHANGE PASSWORD */
router.patch('/', Token.validate, (req, res) =>
  User.changePassword(req.auth.username, req.body.oldPassword, req.body.newPassword)
  .then((token) => res.json({ accessToken: token, status: 200 }))
);

module.exports = router;
