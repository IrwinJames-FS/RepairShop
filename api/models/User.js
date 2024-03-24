const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
	name: {
		type: String,
		required: [true, 'A name must be provided']
	},
	username: {
		type: String,
		lowercase: true,
		required: [true, 'A username must be provided'],
		unique: [true, 'This username has already been taken'],
		validate:{
			validator:v=>/^.{8,}$/.test(v),
			message: `A username must be greater then 8 characters`
		}
	},
	password: {
		type: String,
		required: [true, 'A password must be provided'],
		validate: [
			{validator:v=>v.length >= 8, message:`Password must be 8 characters or greater`},
			{validator:v=>/\d/.test(v), message:`Password must contain numbers`},
			{validator: v=>/[a-z]/.test(v), message: `Password must contain lowercase characters`},
			{validator: v=>/[A-Z]/.test(v), message: `Password must contain capital letters`},
			{validator:v=>/[\!\@\#\$\%\^\&\*]/.test(v), message:`Password must contain special character`}
		]
	},
	permission: {
		type: Number,
		required: [true, 'Permissions must be provided'],
		default: 0
	},
	phone: {
		type: String,
		required: [true, 'A phone number must be provided'],
		unique: [true, 'This phone number has already been used'],
		validate: [v=>/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(v), `A valid phone number must be provided`]
	},
	email: {
		type: String,
		lowercase: true,
		required: [true, 'An email address must be provided'],
		unique: [true, 'This email address has already been used'],
		validate: [v=>/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v), `A valid email must be provided`]
	},
	sessionSignature: { //an encoded signature to determine if access is granted
		type: String
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now()
	}
}, {
	toJSON:{virtuals: true}
});


module.exports = model("User", UserSchema);