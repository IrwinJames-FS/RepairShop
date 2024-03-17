const router = require("express").Router();
const { notAuthenticated } = require("../middleware/authenticated");
const User = require("../models/User");
const {hash} = require("bcrypt");

router.post('/', notAuthenticated, async (req, res) => {
	const { name, phone, email, username, password:pass } = req.body;
	try{
		const password = await hash(pass, 10)
		const user = await User.create({name, username, phone, email, password});
		res.status(201).json(user);
	} catch (error) {
		console.log(error);
		return res.status(400).json({message: error.message});
	}
});

module.exports = router;