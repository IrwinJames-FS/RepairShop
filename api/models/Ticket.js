const { Schema, model } = require("mongoose");

const MaterialSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	price: {
		type: Number,
		required: true
	},
	unit: {
		type: String,
		required: true
	}
});

const TimeSchema = new Schema({
	description: {
		type: String,
		required: true
	},
	duration: {
		type: Number,
		required: true
	}
});

const TicketSchema = new Schema({
	description: {
		type: String,
		required: true,
	},
	details: {
		type: String,
		required: true
	},
	materials: {
		type: [MaterialSchema],
		required: true,
		default: []
	},
	time: {
		type: [TimeSchema],
		required: true,
		default: []
	},
	assignedTo: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	submittedBy: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	createdAt: {
		type: String,
		required: true,
		default: Date.now()
	}
});

module.exports = model("Ticket", TicketSchema);