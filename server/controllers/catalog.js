const Catalog = require('../models/catalog');
const Course = require('../models/course');
const { sendResponse } = require('./utils');

/**
 * 	Get a user course catalog
 * @param {Object} req http request object
 * @param {Object} res httpresponse object
 * @returns http response
 */
module.exports.getCatalog = async (req, res) => {
	const userId = req.user._id;
	try {
		const catalog = await Catalog.find({ user: userId }).select('-user');
		if (!catalog) {
			return sendResponse(res, 404, 'User courses not found!');
		}
		sendResponse(res, 200, catalog);
	} catch (e) {
		console.log(e);
		return sendResponse(res, 500, `Server Error: ${e. message}`);
	}
}

/**
 * 	Add a course to user catalog
 * @param {Object} req http request object
 * @param {Object} res httpresponse object
 * @returns http response
 */
module.exports.addToCatalog = async (req, res) => {
    const { id: courseId } = req.params;
	const { _id: userId } = req.user;
	if (!courseId) {
		return sendResponse(res, 400, 'Course not found!');
	}
    try {
		// check if course & user doc already exist
		const docExist = await Catalog.findOne({ user: userId, course: courseId });
		if (docExist) {
			return sendResponse(res, 400, 'Already enrolled to this course!');
		}

		// check if seats are available
		const _course = await Course.findById(courseId);
		if (!_course) return sendResponse(res, 400, 'Invalid course id!');
		const { available } = _course;
		if (available === 0) return sendResponse(res, 400, 'Seats filled up for this course!');

		// create new and return on any error
		const addedDoc = await Catalog.create({ user: userId, course: courseId });
		if (!addedDoc) {
			return sendResponse(res, 500, 'Unable to enroll into course, try again!');
		}

		// update available seats of the course once successfully added to catalog
		await Course.updateOne({ _id: courseId}, { $inc: { available: -1 } });

		const userCatalog = await Catalog.find({ user: userId }).select('-user');
		
		return sendResponse(res, 201, userCatalog);
    } catch (e) {
        console.log(e.message);
		if (e?.name === 'ValidationError') return sendResponse(res, 400, e.message);
		if (e.message.includes('duplicate key error'))
			return sendResponse(res, 400, 'Course already exists!');
		return sendResponse(res, 500, `Server Error: ${e.message}`);
    }
}

/**
 * 	Remove course from user catalog
 * @param {Object} req http request object
 * @param {Object} res httpresponse object
 * @returns http response
 */
module.exports.removFromCatalog = async (req, res) => {
    const { id: courseId } = req.params;
	const { _id: userId } = req.user;
	if (!courseId) {
		return sendResponse(res, 400, 'Course not found!');
	}
    try {
		// check if course & user doc already exist
		const docExist = await Catalog.findOne({ user: userId, course: courseId });
		if (!docExist) {
			return sendResponse(res, 400, 'Course not found in catalog!');
		}

		// create new and return on any error
		const deletedDoc = await Catalog.findOneAndDelete({ user: userId, course: courseId });
		if (!deletedDoc) {
			return sendResponse(res, 500, 'Unable to delete the course from catalog, try again!');
		}

		// update available seats of the course once successfully removed from catalog
		await Course.updateOne({ _id: courseId}, { $inc: { available: 1 } });

		const userCatalog = await Catalog.find({ user: userId }).select('-user');
		
		return sendResponse(res, 200, userCatalog);
    } catch (e) {
        console.log(e.message);
		if (e?.name === 'ValidationError') return sendResponse(res, 400, e.message);
		if (e.message.includes('duplicate key error'))
			return sendResponse(res, 400, 'Course already exists!');
		return sendResponse(res, 500, `Server Error: ${e.message}`);
    }
}
