const router = require("express").Router();
const authenticated = require("../middleware/authenticated");
const User = require("../models/User");
/**
 * Create user
 * Unlike sign up this allows for customization of all user settings
 */
router.post('/', authenticated, (req, res) => {
	
});

/**
 * Get all users
 * The only users that should be able to see an unfiltered list is admins
 */
router.get('/', authenticated, async (req, res) => {
	const {permission} = res.user;
	console.log(permission);
	if(permission < 2) return res.status(401).json({message: 'Not Authorized'});
	try{
		const users = await User.find({});
		return res.status(200).json(users);
	} catch (error) {
		return res.status(500).json({message: error.message});
	}
});

/**
 * Get a user
 */
router.get('/:id', (req, res)=>{

});

/**
 * Update a user
 */
router.patch('/:id', (req, res)=>{

});

/**
 * Delete a user
 */
router.delete('/:id', (req, res) => {

});
module.exports = router;