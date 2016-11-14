const router = require('express-promise-router')();
const Token = require('../../../model/token');
const User = require('../../../model/user');

/* LOG IN */
router.post('/', function(req, res){
    return User.login(req.body.username, req.body.password)
    .then(function(token){
        res.json({"accessToken": token});
    });
});

/* LOG OUT */
router.delete('/', function(req, res){
    return User.logout(req.body.accessToken)
    .then(function(data){
        res.clearCookie('accessToken');
        res.end();
    });
});

/* CHANGE PASSWORD */
router.patch('/', Token.validate, function(req, res){
    return User.changePassword(
        req.auth.username,
        req.body.oldPassword,
        req.body.newPassword
    )
    .then(function(token){
        res.json({"accessToken": token});
    });
});

module.exports = router;
