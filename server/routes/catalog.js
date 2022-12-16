const { Router } = require('express');
const { protect } = require('../controllers/auth');
const { getCatalog, addToCatalog, removFromCatalog } = require('../controllers/catalog');

const router = Router();

router.use(protect);

router.route('/').get(getCatalog);
router.route('/:id').post(addToCatalog).delete(removFromCatalog);

module.exports = router;
