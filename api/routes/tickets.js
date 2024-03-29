const router = require("express").Router();
const { writeErrors, generalErrors } = require("../controllers/errors");
const { ApiError } = require("../errors");
const { lookup, sublookup } = require("../middleware/lookup");
const Ticket = require('../models/Ticket');


/**
 * Create Ticket
 * Unlike sign up this allows for customization of all user settings
 */
router.post('/', async (req, res, next) => {
	const {permission:userPermission, id} = req.user;
	const {description, details, assignedTo, submittedBy} = req.body;
	try{
		const ticket = await Ticket.create({description, details, assignedTo:userPermission === 2 ? assignedTo:null, submittedBy: submittedBy ?? id});
		return res.status(201).json(ticket);
	} catch (error) {
		return writeErrors(error, next)
	}
});

/**
 * Get all users
 * The only users that should be able to see an unfiltered list is admins
 */
router.get('/', async (req, res, next) => {
	const {permission, id} = req.user;
	try{
		const tickets = await Ticket.find(permission === 2 ? {}:{$or:[{submittedBy: id}, {assignedTo: id}]});
		return res.status(200).json(tickets);
	} catch (error) {
		return generalErrors(error, next);
	}
});

/**
 * Get a ticket
 */
router.get('/:id', async (req, res, next)=>{
	const {permission: userPermission, id: userId} = req.user;
	const { id } = req.params;
	const { populate = 'assignedTo submittedBy' } = req.query;
	try{
		const ticket = await Ticket.findById(id).populate(populate).populate({path: 'comments.author', select: 'username'}).exec();
		if(userPermission < 2 && (ticket.assignedTo?.id !== userId && ticket.submittedBy.id !== userId )) return res.status(401).json({message:'Not Authorized'});
		return res.status(200).json(ticket);
	} catch (error) {
		return generalErrors(error, next);
	}
});

/**
 * Update a ticket
 */
router.patch('/:id', lookup(Ticket, "ticket"), async (req, res, next)=>{
	const {permission: userPermission, id: userId} = req.user;
	const ticket = res.ticket;
	try{
		if (userPermission < 2 && (ticket.assignedTo !== userId && ticket.submittedBy !== userId)) return res.status(401).json({message:'Not Authorized'});
		await ticket.updateOne(req.body);
		return res.status(201).json(ticket);
	} catch (error) {
		return writeErrors(error, next);
	}
});

/**
 * Delete a ticket
 */
router.delete('/:id', async (req, res, next) => {
	const {permission} = req.user;
	const { id } = req.params;
	if(permission < 2) return res.status(401).json({message: 'Not Authorized'});
	try{
		await Ticket.findByIdAndDelete(id);
		return res.status(204).send();
	} catch (error) {
		return generalErrors(error, next);
	}
});


//Handle Comments because comments require ticket information and use a similar api logic might as will list here

router.post('/:id/comment', lookup(Ticket, "ticket", "comments id"), async (req, res, next) => {
	//should do some validation
	try{
		res.ticket.comments.push(req.body);
		await res.ticket.save();
		await res.ticket.populate('comments.author', 'username');
		return res.status(201).json(res.ticket.comments);
	} catch (error) {
		console.log(error);
		return writeErrors(error, next);
	}
});
/**
 * Get all the comments
 */
router.get('/:id/comment', lookup(Ticket, "ticket"), async (req, res, next) => {
	try {
		await res.ticket.populate('comments.author', 'username');
		return res.status(200).json(res.ticket.comments ?? []);
	} catch (error) {
		return generalErrors(error, next)
	}
});

router.get('/:id/comment/:cid', lookup(Ticket, "ticket"), sublookup("ticket", "comments", "cid", "comment", ["comments.author", "username"]), async (req, res) => {
	return res.status(200).json(res.comment);
});

router.patch('/:id/comment/:cid', lookup(Ticket, "ticket"), sublookup("ticket", "comments", "cid", "comment"), async (req, res, next) => {
	const { user } = res;
	if(user.id !== res.comment.author) return res.status(401).json({message: 'Not Authorized'});
	res.comment.comment = req.body.comment;
	try{
		await res.comment.save();
		await res.ticket.populate('comments.author', 'username');
		res.status(201).json(res.ticket.comments);
	} catch (error) {
		return generalErrors(error, next)
	}
});


module.exports = router;