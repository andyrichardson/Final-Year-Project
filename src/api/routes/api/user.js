const Prom = require('bluebird');
const router = require('express-promise-router')();
const base64Img = Prom.promisifyAll(require('base64-img'), {suffix: "Prom"});

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
    res.json({status:200, message:"User created."});
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
router.get('/:username', function(req, res, next){
  // Access token implies friendship or self
  if(req.query.accessToken){
    return Token.validate(req, res, function(){
      return User.getUserAuthenticated(req.auth.username, req.params.username)
      .then(function(data){
        res.json({status: 200, message: data});
      })
    });
  }

  // No private info shared
  return User.getUser(req.params.username)
  .then(function(user){
    res.json({status: 200, message: user});
  });
});

/* GET SELF */
router.get('/', function(req, res, next){
  if(req.query.accessToken === undefined){
    return next();
  }

  return Token.validate(req, res, function(){
    return User.getUserAuthenticated(req.auth.username, req.auth.username)
    .then(function(data){
      res.json({status: 200, message: data});
    });
  });
});

/* UPLOAD IMAGE */
router.post('/image', Token.validate, function(req, res){
  return User.setImage(req.auth.username, req.body.image)
  .then(function(data){
    res.status = 200;
    res.json({status: 200, message: "Updated user image."});
  })
})

/* ADD FRIEND */
router.post('/:username', Token.validate, function(req, res){
  return User.addUser(req.auth.username, req.params.username)
  .then(function(data){
    res.status = 200;
    res.json({status: 200, message: "Friendship created"});
  });
});


module.exports = router;
