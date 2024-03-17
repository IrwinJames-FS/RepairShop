const assertValues = (assertion, ...args) => !!args.filter(n=>assertion(n)).length;
export const newUser = ({name, username, phone, email, permission=0, password, repassword}) => {
	if(assertValues(n=>!n.trim().length, name, username, phone, email, password, repassword)) throw new Error("Required fields are missing");
	if((!password || !repassword) && password !== repassword) throw new Error("Passwords must match");
	return {name, username, phone, email, password, permission};
}

export const updateUser = ({name, username, phone, email, permission, password, repassword}) => {
	if(assertValues(n=>n !== undefined && !n.trim(), name, username, phone, email, password, repassword)) throw new Error("Required fields are missing");
	if(password !== repassword) throw new Error("Passwords must match");
	return {name, username, phone, email, password, permission}
}

export const newTicket = ({description, details, assignedTo, submittedBy}) => {
	if(assertValues(n=>n.trim().length, description, details, submittedBy)) throw new Error(`Ticket is missing necessary fields`);
	return {description, details, assignedTo, submittedBy};
}