const mongoose = require('mongoose');

// Catalog schema to model documents in Catalog collection
const catalogSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
	},
	course: {
		type: mongoose.Schema.ObjectId,
		ref: 'Course',
		required: true,
	}
});

// populate course key with actual course object
catalogSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'course',
	});
	next();
});

// Create catalog model from catalog schema
const Catalog = mongoose.model('Catalog', catalogSchema);

module.exports = Catalog;