const mongoose = require('mongoose');

// Course schema to model documents in Course collection
const courseSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Course title is required'],
			unique: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
			required: [true, 'Course must have description'],
		},
		instructor: {
			type: String,
			trim: true,
			required: [true, 'Course must have an instructor'],
		},
		seats: {
			type: Number,
			required: [true, 'Course must have max seats'],
		},
		available: {
			type: Number,
		},
	},
	{
		timestamps: true,
	}
);

// middleware to leave out keys not required for clients
courseSchema.pre(/^find/, function (next) {
	this.select('-__v -updatedAt -createdAt');
	next();
});

// Create course model from course schema
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
