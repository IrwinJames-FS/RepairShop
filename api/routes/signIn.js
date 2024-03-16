const router = require("express").Router();
const User = require("../models/User");
const {compare} = require("bcrypt");
const {ulid, decodeTime } = require("ulid");
const { DAY } = require("../CONSTANTS");


router.post("/", async (req, res) => {
	const { username, password } = req.body;
	try{
		const user = await User.findOne({username})
		const isMatch = user ? compare(password, user.password):false;
		if(!isMatch) return res.status(400).json({message: "Invalid username or passworld"});
		//create a signature
		if (user.sessionSignature){
			const time = decodeTime(user.sessionSignature);
			if(Date.now()-time > DAY) user.sessionSignature = null; //invalidate the signature
		}
		if(!user.sessionSignature) user.sessionSignature = ulid(); 
		await user.save();
		return res.status(200).json({
			name: user.name, 
			username: user.username, 
			phone: user.phone, 
			email: user.email, 
			permission: user.permission,
			sessionSignature: user.sessionSignature
		});
	} catch (error) {
		return res.status(400).json({message: error.message});
	}
})
module.exports = router;