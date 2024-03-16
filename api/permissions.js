/*
In a production level application this would be handled with a role based system however to emulate a permission system I'll use this.
Any user can see itself and Tickets it created
*/
module.exports = {
	SELF: 0x0, //everyone can modify their tickets and see their tickets basic information
	SPECIALIST: 0x1, //A specialist can modify all ticket fields however should not have access to others tickets
	ADMIN: 0x2, //An admin can read and write to all tickets.
}