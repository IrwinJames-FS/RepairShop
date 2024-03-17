const User = require("../models/User");

//The errors thrown in the try statement are for debug purposes and will not be passed to the client
//Would use a cookie but with third party cookies being blocked by chrome and brave a token or signature of sorts seems to be the most controllable avenue.
const authenticated = async (req, res, next) => {
	const signature = req.body.sig ?? req.query.sig;
	try {
		if(!signature) throw new Error("A signature must be provided");
		const user = await User.findOne({sessionSignature: signature});
		if(!user) throw new Error("Signature Not Found");
		console.log(user, signature);
		res.user = user;
		return next();
	} catch (error) {
		console.error(error.message);
		return res.status(401).json({message:'Not Authorized'});
	}
}

const notAuthenticated = async (req, res, next) => {
	const signature = req.body.sig ?? req.query.sig;
	if(signature) return res.status(403).json({message: 'Not Authorized'});
	return next();
}
module.exports = { authenticated, notAuthenticated };