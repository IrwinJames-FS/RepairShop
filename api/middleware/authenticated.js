const User = require("../models/User");

//The errors thrown in the try statement are for debug purposes and will not be passed to the client
const authenticated = async (req, res, next) => {
	const {sessionSignature} = req.body;
	console.log(sessionSignature);
	try {
		if(!sessionSignature) throw new Error("A signature must be provided");
		const user = await User.find({sessionSignature});
		if(!user) throw new Error("Signature Not Found");
		console.log(user);
		res.user = user;
		return next();
	} catch (error) {
		console.error(error.message);
		return res.status(401).json({message:'Not Authorized'});
	}
}

module.exports = authenticated;