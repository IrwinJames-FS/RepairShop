const passport = require('passport');
const { ExtractJwt, Strategy } = require('passport-jwt');
const LocalStrategy = require('passport-local');
const User = require('../models/User');
const config = require('../config');
const { ApiError } = require('../errors');

const options = {
	secretOrKey: config.secret,
	jwtFromRequest: ExtractJwt.fromHeader('authorization')
};

const strategy = new Strategy(options, async (payload, done) => {
	try {
		const user = await User.findById(payload.sub);
		return done(null, user ?? false);
	} catch (error) {
		return done(new ApiError(error.message), false);
	}
});


const localStrategy = new LocalStrategy({}, async (username, password, done) => {
	try{
		console.log("Running strategy");
		const user = await User.findOne({username}, 'password permission username');
		if(!user) throw new ApiError('username or password invalid');
		console.log("got user", user);
		const isMatch = await user.comparePasswords(password);
		if(!isMatch) throw new ApiError('username or password invalid');
		console.log("Password match");
		return done(null, user);
	} catch (error) {
		console.log(error);
		return done(error instanceof ApiError ? error : new ApiError(error.message), false);
	}
})
passport.use(strategy);
passport.use(localStrategy);
