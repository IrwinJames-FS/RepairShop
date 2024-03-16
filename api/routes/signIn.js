const router = require("express").Router();
const User = require("../models/User");
const {compare} = require("bcrypt");
const {ulid, decodeTime } = require("ulid");

router.post("/", async (req, res) => {
	const { username, password } = req.body;
	try{
		const user = await User.findOne({username})
		const isMatch = user ? compare(password, user.password):false;
		if(!isMatch) return res.status(400).json({message: "Invalid username or passworld"});
		//create a signature
		user.sessionSignature = ulid();
		return res.status(200).json({
			name: user.name, 
			username: user.username, 
			phone: user.phone, 
			email: user.email, 
			permission: user.permission,
			sessionSignature: user.sessionSignature
		})
	} catch (error) {
		return res.status(400).json({message: error.message});
	}
})
module.exports = router;