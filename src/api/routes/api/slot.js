const router = require('express-promise-router')();
const Token = require('../../model/token');
const Slot = require('../../model/slot');

/* CREATE SLOT */
router.post('/', Token.validate, function(req, res){
    const start = new Date(req.body.start);
    const finish = new Date(req.body.finish);

    return Slot.create(req.auth.username, start, finish)
    .then(function(data){
        res.status = 200;
        res.json({status:200, message:"Slot created."});
    });
});

/* RESPOND TO SLOT */
router.post('/respond', Token.validate, function(req, res){
  return Slot.respond(req.auth.username, req.body.slotId)
  .then(function(){
    res.status = 200;
    res.json({status: 200, message: "Slot response successfully submitted."});
  });
})

module.exports = router;
