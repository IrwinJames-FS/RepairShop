const { Schema, model } = require("mongoose");
const { ApiError } = require("../errors");
const { invalidData } = require("../httpCodes");
const bcrypt = require('bcrypt');


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
	//removed validators because password will already be hashed
	password: {
		type: String,
		required: [true, 'A password must be provided'],
		
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
	//this field will not longer be used and data should be ignored for this field.
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




const validatePassword = password => {
	//verify the length
	if(password.length < 8) return new ApiError(`Password must be 8 characters or greater`, invalidData);
	//make sure it contains at least 1 digit, 1 lower case character, 1 upper case character, 1 special character
	if(!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&\*])/.test(password)) return new ApiError(`Password must contain at least 1 digit, 1 lower and upper case character, 1 special character (!@#$%^&*)`, invalidData);
}
UserSchema.pre('save', async function(next) {
	if(!this.isNew && !this.isModified('password')) return next();

	const err = validatePassword(this.password);
	if(err) return next(err);

	try{
		//since not storing the salt hash now accept the number of salt rounds as an optional second argument.
		this.password = await bcrypt.hash(this.password, 10);
		return next();
	} catch (error) {
		//rethrowing the error basically just with a defined error class... fingers crossed mongoose doesnt do the same thing
		return next(new ApiError('This is embarassing please try again'));
	}
})

UserSchema.methods.comparePasswords = async function(pass){
	//I dont want bcrypt errors to bubble to the surface instead I will just throw a generalized error
	try {
		const isMatch = await bcrypt.compare(pass, this.password);
		return isMatch;
	} catch (error) {
		console.log("Uh oh", error);
		throw new ApiError(error.messsage);
	}
}
module.exports = model("User", UserSchema);