const router = require('express-promise-router')();
const Token = require('../../model/token');
const Slot = require('../../model/slot');

/* CREATE SLOT */
router.post('/', Token.validate, function(req, res){
    const start = req.body.start;
    const finish = req.body.finish;

    return Slot.create(req.auth.username, start, finish)
    .then(function(data){
        res.status = 200;
        res.json({status:200, message:"Slot created."});
    });
});

/* GET SLOT FEED */
router.get('/', Token.validate, function(req, res){
  Slot.getFeed(req.auth.username, req.query.date, req.query.start, req.query.finish)
  .then(function(data){
    res.status = 200;
    res.json({status: 200, message: data});
  })
})

/* RESPOND TO SLOT */
router.post('/respond', Token.validate, function(req, res){
  return Slot.respond(req.auth.username, req.body.slotId)
  .then(function(){
    res.status = 200;
    res.json({status: 200, message: "Slot response successfully submitted."});
  });
})

/* CONFIRM SLOT */
router.post('/confirm', Token.validate, function(req, res){
  return Slot.confirm(req.auth.username, req.body.username, req.body.slotId)
  .then(function(data){
    res.status = 200;
    res.json({status: 200, message: "Meeting successfully created."});
  });
});

/* DECLINE SLOT */
router.post('/decline', Token.validate, function(req, res){
  return Slot.decline(req.auth.username, req.body.username, req.body.slotId)
  .then(function(data){
    res.status = 200;
    res.json({status: 200, message: "Slot request successfully declined."});
  });
});

module.exports = router;
