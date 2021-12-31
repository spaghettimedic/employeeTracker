const router = require('express').Router();

router.use(require('./deptRoutes'));
router.use(require('./roleRoutes'));
router.use(require('./employeeRoutes'));

module.exports = router;
