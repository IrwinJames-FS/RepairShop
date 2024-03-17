export const newUser = ({name, username, phone, email, permission=0, password, repassword}) => {
	if([name, username, phone, email, password, repassword].filter(n=>!n.trim()).length) throw new Error("Required fields are missing");
	if((!password || !repassword) && password !== repassword) throw new Error("Passwords must match");
	return {name, username, phone, email, password, permission};
}

export const updateUser = ({name, username, phone, email, permission, password, repassword}) => {
	if([name, username, phone, email, password, repassword].filter(n=>n !== undefined && !n.trim()).length) throw new Error("Required fields are missing");
	if(password !== repassword) throw new Error("Passwords must match");
	return {name, username, phone, email, password, permission}
}