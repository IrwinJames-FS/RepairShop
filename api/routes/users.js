const router = require("express").Router();
const { hash } = require("bcrypt");
const { authenticated } = require("../middleware/authenticated");
const User = require("../models/User");

router.get('/username/:username', async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({username}, 'id');
		return res.status(200).json({exists: !!user});
	} catch (error) {
		return res.status(500).json({message: error.message});
	}
});

router.get('/email/:email', async (req, res) => {
	const {email} = req.params;
	return User.findOne({email}, 'id')
	.then(u=>res.status(200).json({exists: !!u}))
	.catch(e=>res.status(500).json({message: error.message}));
});

router.get('/phone/:phone', async (req, res) => {
	const {phone} = req.params;
	return User.findOne({phone}, 'id')
	.then(u=>res.status(200).json({exists:!!u}))
	.catch(e=>res.status(500).json({message: error.message}));
})
/**
 * Create user
 * Unlike sign up this allows for customization of all user settings
 */
router.post('/', authenticated, async (req, res) => {
	const {permission:userPermission} = res.user;
	if(userPermission < 2) return res.status(401).json({message: 'Not Authorized'});
	const {name, username, email, phone, password:pass, permission} = req.body;
	
	console.log("Attempting to save user");
	try{
		const password = await hash(pass, 10);
		const user = await User.create({name, username, email, phone, password, permission});
		return res.status(201).json(user);
	} catch (error) {
		if(error.errors) return res.status(400).json({errors:Object.keys(error.errors).reduce((p,c,i)=>({...p, [c]:error.errors[c].message}), {}), message: "Please fix the following errors"});
		if(!error.code) return res.status(500).json({message: error.message});
		switch (error.code) {
			case 11000:
				const key = Object.keys(error.keyPattern)[0]
				return res.status(400).json({message: `Duplicate ${key}`});
		}
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
	const {permission: filterPermission, fields} = req.query;
	if(fields && (!Array.isArray(fields) || fields.length === 0)) return res.status(400).json({message:"The fields query item must be an array"});
	if(fields && fields.includes("password")) return res.status(403).json({message: "Absolutely Not"});
	try{
		const users = await User.find(filterPermission ? {permission: filterPermission}:{}, fields ? fields.join(' '):'id name phone email username');
		return res.status(200).json(users);
	} catch (error) {
		console.log(error);
		return res.status(500).json({message: error.message});
	}
});

/**
 * Get a user
 */
router.get('/:id', authenticated, async (req, res)=>{
	const {permission: userPermission} = res.user;
	if(userPermission < 2) return res.status(401).json({message: 'Not Authorized'});
	const { id } = req.params;
	try{
		const user = await User.findById(id, '-password');
		if(!user) return res.status(404).json({message: 'User not found'});
		return res.status(200).json(user);
	} catch (error) {
		return res.status(500).json({message: error.message});
	}
});

/**
 * Update a user
 */
router.patch('/:id', authenticated, async (req, res)=>{
	const {permission: userPermission, id: userId} = res.user;
	const { id } = req.params;
	if(userId !==  id && userPermission < 2) return res.status(401).json({message:'Not Authorized'});
	try{
		const {password, ...body} = req.body;
		if(password) body.password = await hash(password, 10);
		const user = await User.findByIdAndUpdate(id, body);
		if(!user) return res.status(404).json({message: 'User not found'});
		return res.status(201).json(user);
	} catch (error) {
		if(error.errors) return res.status(400).json({errors:Object.keys(error.errors).reduce((p,c,i)=>({...p, [c]:error.errors[c].message}), {}), message: "Please fix the following errors"});
		if(!error.code) return res.status(500).json({message: error.message});
		switch (error.code) {
			case 11000:
				const key = Object.keys(error.keyPattern)[0]
				return res.status(400).json({errors: {[key]:'Already Taken'}});
		}
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