const router = require('express-promise-router')();
const User = require('../../../model/user');

/* GET */
router.get('/:query', (req, res) =>
  User.search(req.params.query)
  .then((data) => res.json(data))
);

module.exports = router;
