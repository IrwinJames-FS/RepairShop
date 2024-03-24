const { Schema, model } = require("mongoose");

const CommentsSchema = new Schema({
	comment: {
		type: String,
		required: [true, "A comment must be provided"],
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
}, {
	toJSON: {virtuals: true}
})
const TicketSchema = new Schema({
	description: {
		type: String,
		required: [true, "We need a description"],
	},
	details: {
		type: String,
		required: [true, "Please provide as much detail as possible"]
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
}, {
	toJSON: {virtuals: true}
});

module.exports = model("Ticket", TicketSchema);