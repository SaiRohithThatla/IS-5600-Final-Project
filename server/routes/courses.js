const { Router } = require('express');
const { protect, restrictTo } = require('../controllers/auth');
const { getCourses, getCourse, createCourse, updateCourse, deleteCourse } = require('../controllers/courses');

const router = Router();

router.use(protect);

router.route('/').get(getCourses);

// Restricts course get/add/update/delete by course id to ADMIN role only
router.use(restrictTo('ADMIN'));

router.route('/').post(createCourse);
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
