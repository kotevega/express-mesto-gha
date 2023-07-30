const router = require('express').Router();
const auth = require('../middlewares/auth');
const { ErrorNotFound } = require('../utils/error');

router.use('/users', auth, require('./users'));
router.use('/cards', auth, require('./cards'));

router.use('*', (req, res, next) => {
  next(new ErrorNotFound('Страница не найдена'));
});

module.exports = router;
