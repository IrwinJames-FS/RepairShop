const router = require("express").Router();
const { hash } = require("bcrypt");
const User = require("../models/User");
const { created, invalidData, bad, ok } = require("../httpCodes");
const { writeErrors, generalErrors } = require("../controllers/errors");
const { ApiError } = require("../errors");

/**
 * Create user
 * Unlike sign up this allows for customization of all user settings
 */
router.post('/', async (req, res, next) => {
	const {permission:userPermission} = req.user;
	if(userPermission < 2) return res.status(401).json({message: 'Not Authorized'});
	const {name, username, email, phone, password, permission} = req.body;
	console.log(req.body);
	try{
		const user = await User.create({name, username, email, phone, password, permission});
		return res.status(created).json(user);
	} catch (error) {
		return writeErrors(error, next);
	}
});

/**
 * Get all users
 * The only users that should be able to see an unfiltered list is admins
 */
router.get('/', async (req, res) => {
	const {permission} = req.user;
	if(permission < 2) return res.status(401).json({message: 'Not Authorized'});
	const {permission: filterPermission, fields} = req.query;
	if(fields && (!Array.isArray(fields) || fields.length === 0)) return res.status(400).json({message:"The fields query item must be an array"});
	if(fields && fields.includes("password")) return res.status(403).json({message: "Absolutely Not"});
	try{
		const users = await User.find(filterPermission ? {permission: filterPermission}:{}, fields ? fields.join(' '):'id name phone email username');
		return res.status(ok).json(users);
	} catch (error) {
		return generalErrors(error, next);
	}
});

/**
 * Get a user
 */
router.get('/:id', async (req, res, next)=>{
	const {permission: userPermission, _id} = req.user;
	const { id } = req.params;
	if(userPermission < 2 && ''+_id !== id) return res.status(401).json({message: 'Not Authorized'});
	try{
		const user = await User.findById(id, '-password');
		if(!user) return res.status(404).json({message: 'User not found'});
		return res.status(200).json(user);
	} catch (error) {
		return generalErrors(error, next);
	}
});

/**
 * Update a user
 */
router.patch('/:id', async (req, res)=>{
	const {permission: userPermission, id: userId} = req.user;
	const { id } = req.params;
	console.log("Wham")
	if(userId !==  id && userPermission < 2) return res.status(401).json({message:'Not Authorized'});
	try{
		const user = await User.findByIdAndUpdate(id, req.body);
		if(!user) return res.status(404).json({message: 'User not found'});
		return res.status(201).json(user);
	} catch (error) {
		return writeErrors(error, next);
	}
});

/**
 * Delete a user
 */
router.delete('/:id', async (req, res, next) => {
	const {permission} = req.user;
	const { id } = req.params;
	if(permission < 2) return res.status(401).json({message: 'Not Authorized'});
	try{
		const user = await User.findByIdAndDelete(id);
		return res.status(204).send();
	} catch (error) {
		return generalErrors(error, next)
	}
});
module.exports = router;