const router = require("express").Router();
const User = require("../models/User");

router.get("/count", async (req, res) => {
	try {
		const count = await User.countDocuments({});
		res.status(200).json({count})
	} catch (error) {
		console.log(error);
		return res.status(500).json({message: error.message});
	}
});

module.exports = router;