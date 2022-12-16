const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User schema to model documents in User collection
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'user name is required'],
		trim: true,
		unique: true,
	},
	email: {
		type: String,
		required: [true, 'email is required'],
		unique: true,
		trim: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: true,
		select: false,
	},
	role: {
		type: String,
		enum: ['STUDENT', 'ADMIN'],
		default: 'STUDENT',
	},
});

// Schema method to compare passwords while signing in
userSchema.methods.comparePassword = async function (clientPsd, userPsd) {
	return await bcrypt.compare(clientPsd, userPsd);
};

// encrypt password before saving user to db
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Create user model from user schema
const User = mongoose.model('User', userSchema);

module.exports = User;