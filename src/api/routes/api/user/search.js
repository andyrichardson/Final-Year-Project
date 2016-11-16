const router = require('express-promise-router')();
const User = require('../../../model/user');

/* GET */
router.get('/:query', function(req, res){
    return User.search(req.params.query)
    .then(function(data){
      res.json(data);
    });
});

module.exports = router;
