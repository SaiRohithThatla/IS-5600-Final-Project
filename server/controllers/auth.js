const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { sendResponse } = require('./utils');

/**
 * Sign user id with jwt secret
 * @param {string} id user id
 * @returns signed jwt token
 */
const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRY,
	});
};

/**
 * Send jwt token repsonse post signup/signin
 * @param {Object} user user object
 * @param {number} statusCode status code of response to be sent
 * @param {Object} res response object
 */
const sendTokenToClient = (user, statusCode, res) => {
	const token = signToken(user._id);
	// remove password key from user before sending to client
	user.password = undefined;
	res.status(statusCode).json({
		status: 'success',
		data: {
			token,
			user,
		},
	});
};

/**
 * Create user and return return user with signed jwt token
 * @param {Object} req http request object
 * @param {Object} res http response object
 * @returns http response
 */
const signUp = async (req, res) => {
	const { name, email, password } = req.body;
	try {
		const newUser = await User.create({
			name,
			email,
			password,
		});
		sendTokenToClient(newUser, 201, res);
	} catch (e) {
		console.log(e.message);
		if (e?.name === 'ValidationError') return sendResponse(res, 400, e.message);
		if (e.message.includes('duplicate key error'))
			return sendResponse(res, 400, 'User already exists!');
		return sendResponse(res, 500, e.message);
	}
};

/**
 * Verifies credentials and return user with signed jwt token
 * @param {Object} req http request object
 * @param {Object} res http response object
 * @returns http response
 */
const signIn = async (req, res, next) => {
	const { email, password } = req.body;
	// console.log(req.body);
	try {
		// 1. check email & password are valid
		if (!email || !password) {
			return sendResponse(res, 400, 'Provide valid email and password!');
		}

		// 2. check if user exists & password are valid
		const user = await User.findOne({ email }).select('+password'); // select password to compare it with client's password

		if (!user || !(await user.comparePassword(password, user.password))) {
			return sendResponse(res, 400, 'Incorrect email or password!');
		}

		// 3. if all good, send back new token
		sendTokenToClient(user, 200, res);
	} catch (e) {
		console.log(e);
	}
};

/**
 * Get logged in user
 * @param {Object} req http request object
 * @param {Object} res http response object
 * @returns http response
 */
const getLoggedUser = async (req, res) => {
	try {
		return sendResponse(res, 200, req.user);
	} catch (e) {
		console.log(e);
	}
};

/**
 * Validated token in request headers and update request based on validation
 * @param {Object} req http request object
 * @param {Object} res http response object
 * @param {function} next function to let request go to next middleware
 * @returns http error response on any error
 */
const protect = async (req, res, next) => {
	try {
		// 1) check token exists
		const { authorization } = req.headers;
		let token;
		if (authorization && authorization.startsWith('Bearer')) {
			token = authorization.split(' ')[1];
		}
		if (!token || token === 'null') {
			return sendResponse(res, 403, 'You are not authorised, please log in');
		}

		// 2) check if token is valid (verify token)
		const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

		// 3) check if the user exists
		const currentUser = await User.findById(decoded.id);
		if (!currentUser) {
			return sendResponse(res, 401, `User doesn't exists, please log in again!`);
		}
		// TOKEN VERIFICATION PASSED!
		// Grant access to current user
		req.user = currentUser;

		// proceed to next once user is verified
		next();
	} catch (e) {
		console.log(e);
	}
};

/**
 * Authorize users to access further middlewares
 * @param  {...String} roles array of roles that can have access
 * @returns error response on any error
 */
const restrictTo =
	(...roles) =>
	(req, res, next) => {
		// roles => admin
		// get req.user from protect middleware after passing token check
		if (!roles.includes(req.user.role)) {
			return sendResponse(res, 403, 'You do not have permission to perform this action');
		}
		next();
	};

module.exports = {
	signUp,
	signIn,
	getLoggedUser,
	protect,
	restrictTo,
};
