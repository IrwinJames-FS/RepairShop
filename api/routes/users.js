const router = require("express").Router();
const authenticated = require("../middleware/authenticated");
const User = require("../models/User");
/**
 * Create user
 * Unlike sign up this allows for customization of all user settings
 */
router.post('/', authenticated, async (req, res) => {
	const {permission:userPermission} = res.user;
	if(userPermission < 2) return res.status(401).json({message: 'Not Authorized'});
	const {name, username, email, phone, password, permission} = req.body;
	const user = new User({name, username, email, phone, password, permission});
	try{
		const usr = await user.save();
		return res.status(201).json(usr);
	} catch (error) {
		return res.status(400).json({message: error.message});
	}
});

/**
 * Get all users
 * The only users that should be able to see an unfiltered list is admins
 */
router.get('/', authenticated, async (req, res) => {
	const {permission} = res.user;
	if(permission < 2) return res.status(401).json({message: 'Not Authorized'});
	try{
		const users = await User.find({}, '-password');
		return res.status(200).json(users);
	} catch (error) {
		return res.status(500).json({message: error.message});
	}
});

/**
 * Get a user
 */
router.get('/:id', authenticated, async (req, res)=>{
	const {permission: userPermission} = res.user;
	if(permission < 2) return res.status(401).json({message: 'Not Authorized'});
	const { id } = req.params;
	try{
		const user = await User.findById(id);
		if(!user) return res.status(404).json({message: 'User not found'});
		return res.status(200).json(user);
	} catch (error) {
		return res.status(500).json({message: error.message});
	}
});

/**
 * Update a user
 */
router.patch('/:id', async (req, res)=>{
	const {permission: userPermission, id: userId} = res.user;
	const { id } = req.params;
	if(userId !==  id && userPermission < 2) return res.status(401).json({message:'Not Authorized'});
	try{
		const user = await User.findByIdAndUpdate(id, req.body);
		if(!user) return res.status(404).json({message: 'User not found'});
		return res.status(201).json(user);
	} catch (error) {
		return res.status(400).json({message: error.message});
	}
});

/**
 * Delete a user
 */
router.delete('/:id', authenticated, async (req, res) => {
	const {permission} = res.user;
	const { id } = req.params;
	if(permission < 2) return res.status(401).json({message: 'Not Authorized'});
	try{
		const user = await User.findByIdAndDelete(id);
		return res.status(204).send();
	} catch (error) {
		return res.status(500).json({message: error.message});
	}
});
module.exports = router;