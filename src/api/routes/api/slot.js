const router = require('express-promise-router')();
const Token = require('../../model/token');
const Slot = require('../../model/slot');

/* CREATE USER */
router.post('/', Token.validate, function(req, res){
    const start = new Date(req.body.start);
    const finish = new Date(req.body.finish);
    return Slot.create(req.auth.username, start, finish)
    .then(function(data){
        res.status = 200;
        res.end();
    });
});

module.exports = router;
