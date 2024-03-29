const { invalidData, ok, created, serverError } = require('../httpCodes');
const User = require('../models/User');
const jwt = require('jwt-simple');
const config = require('../config');

/**
 * Creates the jwt token
 * @param {User} user 
 * @returns 
 */
const tokenForUser = user => {
	const iat = new Date().getTime();
	return jwt.encode({
		sub: user._id,
		iat
	}, config.secret);
}


/**
 * Handles the sign up route
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */

exports.signup = async (req, res, next) => {
	const {email, password, name, username, phone} = req.body;
	if(new Set([!!email, !!password, !!name, !!username, !!phone]).has(false)) return res.status(invalidData).json("You are missing necessary information");
	//mongoose unique method will let me know if a user with matching unique credentials already exists
	try {
		const user = await User.create({email, name, password, username, phone, permission:0});
		return res.status(created).json({user_id: user._id, permission: user.permission, username:user.username, token: tokenForUser(user)});
	} catch (error) {
		if(error instanceof PasswordError) return res.status(invalidData).json({password: error.message});
		if(error instanceof HashError) return res.status(serverError).json({message: error.message});
		//mongo field specific errors
		if(error.errors) return res.status(invalidData).json({errors:Object.keys(error.errors).reduce((p,c,i)=>({...p, [c]:error.errors[c].message}), {}), message: "Please fix the following errors"});
		//db error
		if(!error.code) return res.status(serverError).json({message: error.message});

		//duplicate key errors
		switch (error.code) {
			case 11000:
				const key = Object.keys(error.keyPattern)[0]
				return res.status(invalidData).json({message: `${key} already used`});
		}

		//fallthrough
		return res.status(invalidData).json({message: error.message});
	}
}

/**
 * Handles the sign in route
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */

exports.signin = async (req, res, next) => {
	const user = req.user;
	res.status(ok).json({user_id: user._id, permission:user.permission, username:user.username, token: tokenForUser(user)})
}