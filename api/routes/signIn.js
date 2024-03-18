const router = require("express").Router();
const User = require("../models/User");
const {compare} = require("bcrypt");
const {ulid, decodeTime } = require("ulid");
const { DAY } = require("../constants");


router.post("/", async (req, res) => {
	const { username, password } = req.body;
	try{
		const user = await User.findOne({username});
		const isMatch = user ? await compare(password, user.password):false;
		if(!isMatch) return res.status(400).json({message: "Invalid username or password"});
		//create a signature
		if (user.sessionSignature){
			const time = decodeTime(user.sessionSignature);
			if(Date.now()-time > DAY) user.sessionSignature = null; //invalidate the signature
		}
		if(!user.sessionSignature) user.sessionSignature = ulid(); 
		await user.save();
		return res.cookie("signature", user.sessionSignature).status(201).json({
			id: user.id,
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