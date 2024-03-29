const assertValues = (assertion, ...args) => !!args.filter(n=>assertion(n)).length;
//Just a method to standardize how to evaluate passwords before sending request
const matchPassword = (password, repassword) => {
	if(password !== repassword) throw new Error('Passwords do not match');
	return password;
}

export const validateSignIn = ({username, password}) => {
	if(!username || !password) throw new Error('You must provide a username or password');
	return {username, password};
}

export const validateNewUser = ({name, username, phone, email, permission=0, password, repassword}) => {
	console.log(name, username, phone, email, password, repassword, permission);
	if(assertValues(n=>!n.trim().length, name, username, phone, email, password, repassword)) throw new Error("Required fields are missing");
	return {name, username, phone, email, password:matchPassword(password, repassword), permission};
}

export const validateUpdateUser = ({name, username, phone, email, permission, password, repassword}) => {
	if(assertValues(n=>n !== undefined && !n.trim(), name, username, phone, email)) throw new Error("Required fields are missing");
	return {name, username, phone, email, password: matchPassword(password, repassword), permission}
}


export const validateNewTicket = ({description, details, assignedTo, submittedBy}) => {
	console.log(description, details, submittedBy, assignedTo);
	if(assertValues(n=>!n.trim().length, description, details, submittedBy)) throw new Error(`Ticket is missing necessary fields`);
	return {description, details, assignedTo, submittedBy};
}

export const passthrough = vals=>vals;