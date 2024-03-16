const { Schema, model } = require("mongoose");

const CommentsSchema = new Schema({
	comment: {
		type: String,
		required: true,
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now()
	}
})
const TicketSchema = new Schema({
	description: {
		type: String,
		required: true,
	},
	details: {
		type: String,
		required: true
	},
	comments: {
		type: [CommentsSchema],
		required: true,
		default: []
	},
	assignedTo: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	submittedBy: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	createdAt: {
		type: String,
		required: true,
		default: Date.now()
	}
});

module.exports = model("Ticket", TicketSchema);