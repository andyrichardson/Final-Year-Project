const router = require('express-promise-router')();
const Token = require('../../model/token');
const User = require('../../model/user');

const authRouter = require('./user/auth');
const searchRouter = require('./user/search');

/* ATHENTICATION */
router.use('/auth', authRouter);
router.use('/search', searchRouter);

/* CREATE USER */
router.post('/', function(req, res){
    return User.create(req.body)
    .then(function(){
        res.status = 200;
        res.end();
    });
});

/* UPDATE INFO */
router.patch('/', Token.validate, function(req, res){
    return User.edit(req.auth.username, req.body)
    .then(function(data){
        res.status = 201;
        res.end();
    });
});

/* GET USER */
router.get('/:username', function(req, res){
    return User.getUser(req.params.username)
    .then(function(user){
        console.log(user);
        res.json(user);
    });
});

module.exports = router;
