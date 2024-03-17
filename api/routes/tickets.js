const router = require("express").Router();
const { authenticated } = require("../middleware/authenticated");
const { lookup, sublookup } = require("../middleware/lookup");
const Ticket = require('../models/Ticket');


/**
 * Create Ticket
 * Unlike sign up this allows for customization of all user settings
 */
router.post('/', authenticated, async (req, res) => {
	const {permission:userPermission, id, ...user} = res.user;
	const {description, details, assignedTo, submittedBy} = req.body;
	try{
		const ticket = await Ticket.create({description, details, assignedTo:userPermission === 2 ? assignedTo:null, submittedBy: submittedBy ?? id});
		return res.status(201).json(ticket);
	} catch (error) {

		return res.status(400).json({message: error.message});
	}
});

/**
 * Get all users
 * The only users that should be able to see an unfiltered list is admins
 */
router.get('/', authenticated, async (req, res) => {
	const {permission, id} = res.user;
	try{
		const tickets = await Ticket.find(permission === 2 ? {}:{$or:[{submittedBy: id}, {assignedTo: id}]});
		return res.status(200).json(tickets);
	} catch (error) {
		return res.status(500).json({message: error.message});
	}
});

/**
 * Get a ticket
 */
router.get('/:id', authenticated, async (req, res)=>{
	const {permission: userPermission, userId} = res.user;
	const { id } = req.params;
	const { populate = 'assignedTo submittedBy' } = req.query;
	try{
		const ticket = await Ticket.findById(id).populate(populate);
		if(userPermission < 2 && (ticket.assignedTo.id !== userId && ticket.submittedBy.id !== userId )) res.status(401).json({message:'Not Authorized'});
		return res.status(200).json(ticket);
	} catch (error) {
		return res.status(500).json({message: error.message});
	}
});

/**
 * Update a ticket
 */
router.patch('/:id', authenticated, lookup(Ticket, "ticket"), async (req, res)=>{
	const {permission: userPermission, id: userId} = res.user;
	const ticket = res.ticket;
	try{
		if (userPermission < 2 && (ticket.assignedTo !== userId && ticket.submittedBy !== userId)) return res.status(401).json({message:'Not Authorized'});
		await ticket.updateOne(req.body);
		return res.status(201).json(ticket);
	} catch (error) {
		return res.status(400).json({message: error.message});
	}
});

/**
 * Delete a ticket
 */
router.delete('/:id', authenticated, async (req, res) => {
	const {permission} = res.user;
	const { id } = req.params;
	if(permission < 2) return res.status(401).json({message: 'Not Authorized'});
	try{
		await Ticket.findByIdAndDelete(id);
		return res.status(204).send();
	} catch (error) {
		return res.status(500).json({message: error.message});
	}
});


//Handle Comments because comments require ticket information and use a similar api logic might as will list here

router.post('/:id/comment', authenticated, lookup(Ticket, "ticket", "comments id"), async (req, res) => {
	//should do some validation
	try{
		res.ticket.comments.push(req.body);
		await res.ticket.save();
		await res.ticket.populate('comments.author', 'username');
		return res.status(201).json(res.ticket.comments);
	} catch (error) {
		return res.status(400).json({message: error.message });
	}
});
/**
 * Get all the comments
 */
router.get('/:id/comment', authenticated, lookup(Ticket, "ticket"), async (req, res) => {
	try {
		await res.ticket.populate('comments.author', 'username');
		return res.status(200).json(res.ticket.comments ?? []);
	} catch (error) {
		return res.status(500).json({message: error.message});
	}
});

router.get('/:id/comment/:cid', authenticated, lookup(Ticket, "ticket"), sublookup("ticket", "comments", "cid", "comment", ["comments.author", "username"]), async (req, res) => {
	return res.status(200).json(res.comment);
});

router.patch('/:id/comment/:cid', authenticated, lookup(Ticket, "ticket"), sublookup("ticket", "comments", "cid", "comment"), async (req, res) => {
	const { user } = res;
	if(user.id !== res.comment.author) return res.status(401).json({message: 'Not Authorized'});
	res.comment.comment = req.body.comment;
	try{
		await res.comment.save();
		await res.ticket.populate('comments.author', 'username');
		res.status(201).json(res.ticket.comments);
	} catch (error) {
		return res.status(500).json({message: error.message});
	}
});


module.exports = router;