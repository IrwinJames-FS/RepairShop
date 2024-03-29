/*
A file to do some setup if this is the first time the server is being launched

*/

const User = require("./models/User");
const { hash } = require("bcrypt");

const initialize = async () => {
	try {
		const count = await User.countDocuments({});
		if(count > 0) return;
		const { INIT_USER_NAME, INIT_USER_USERNAME, INIT_USER_PHONE, INIT_USER_EMAIL, INIT_USER_PASSWORD, INIT_USER_PERMISSION } = process.env;

		//hash password
		const user = new User({
			name: INIT_USER_NAME,
			username: INIT_USER_USERNAME,
			phone: INIT_USER_PHONE,
			email: INIT_USER_EMAIL,
			password: INIT_USER_PASSWORD,
			permission: INIT_USER_PERMISSION
		});
		await user.save();
	} catch (error) {
		console.log(error);
	}
}

module.exports = initialize;