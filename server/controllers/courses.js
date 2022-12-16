const Course = require('../models/course');
const Catalog = require('../models/catalog');
const { sendResponse } = require('./utils');

/**
 * 	Get a course by course id
 * @param {Object} req http request object
 * @param {Object} res httpresponse object
 * @returns http response
 */
module.exports.getCourse = async (req, res) => {
	const courseId = req.params.id;
	try {
		const doc = await Course.findById(courseId);
		if (!doc) {
			return sendResponse(res, 404, 'Course not found!');
		}

		sendResponse(res, 200, doc);
	} catch (e) {
		console.log(e);
		return sendResponse(res, 500, `Server Error: ${e.message}`);
	}
};

/**
 * 	Create a new course
 * @param {Object} req http request object
 * @param {Object} res httpresponse object
 * @returns http response
 */
module.exports.createCourse = async (req, res) => {
	const { title, description, instructor, seats } = req.body;
	try {
		await Course.create({ title, description, instructor, seats, available: seats });
		const courses = await Course.find({}).collation({ locale: 'en' }).sort({ title: 1 });
		return sendResponse(res, 201, courses);
	} catch (e) {
		console.log(e.message);
		if (e?.name === 'ValidationError') return sendResponse(res, 400, e.message);
		if (e.message.includes('duplicate key error'))
			return sendResponse(res, 400, 'Course already exists!');
		return sendResponse(res, 500, `Server Error: ${e.message}`);
	}
};

/**
 * 	Get all courses
 * @param {Object} req http request object
 * @param {Object} res httpresponse object
 * @returns http response
 */
module.exports.getCourses = async (req, res) => {
	try {
		const courses = await Course.find({}).collation({ locale: 'en' }).sort({ title: 1 });
		return sendResponse(res, 200, courses);
	} catch (e) {
		console.log(e);
	}
};

/**
 * 	Update a course by course id
 * @param {Object} req http request object
 * @param {Object} res httpresponse object
 * @returns http response
 */
module.exports.updateCourse = async (req, res) => {
	const courseId = req.params.id;
	const { title, description, instructor, seats, available } = req.body;
	try {
		const doc = await Course.findById(courseId);
		if (!doc) {
			return sendResponse(res, 404, 'Course not found!');
		}

		doc.title = title;
		doc.description = description;
		doc.instructor = instructor;
		doc.seats = seats;
		doc.available = available;

		await doc.save();

		const courses = await Course.find({}).collation({ locale: 'en' }).sort({ title: 1 });
		sendResponse(res, 201, courses);
	} catch (e) {
		console.log(e);
		return sendResponse(res, 500, `Server Error: ${e.message}`);
	}
};

/**
 * 	Delete a course by course id
 * @param {Object} req http request object
 * @param {Object} res httpresponse object
 * @returns http response
 */
module.exports.deleteCourse = async (req, res) => {
	const courseId = req.params.id;
	try {
		const doc = await Course.findByIdAndDelete(courseId);
		if (!doc) {
			return sendResponse(res, 404, 'Course not found!');
		}
		await Catalog.deleteMany({ course: { _id: courseId } });

		// return latest course
		this.getCourses(req, res);
	} catch (e) {
		console.log(e);
		return sendResponse(res, 500, `Server Error: ${e.message}`);
	}
};
