const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true,
		unique: true,
		validator:[v=>/^.{8,}$/.test(v), `A username must be greater then 8 characters`]
	},
	password: {
		type: String,
		required: true,
		validator: [v=>/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(v), `Your password must containe at least 8 characters with at least one of each of the following character types (Uppercase, Lowercase, Numeric and !@#$%^&*)`]
	},
	permission: {
		type: Number,
		required: true,
		default: 0
	},
	phone: {
		type: String,
		required: true,
		unique: true,
		validator: [v=>/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(v), `A valid phone number must be provided`]
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validator: [v=>/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v), `A valid email must be provided`]
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