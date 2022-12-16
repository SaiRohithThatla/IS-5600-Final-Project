const FAILURES_CODES = [400, 401, 403, 404, 500];

/**
 * Send http response with data/error with status code to client
 * @param {Object} res http response object
 * @param {Number} code status code
 * @param {(Object,String)} data data to be sent to client
 */
const sendResponse = (res, code, data) => {
	const obj = {
		status: 'success',
	};
	if (FAILURES_CODES.includes(code)) {
		obj.status = 'error';
		obj.message = data;
		console.log('ERROR:: ', data);
	} else {
		obj.data= data;
	}
	res.status(code).json(obj);
};

module.exports = {
	sendResponse,
};