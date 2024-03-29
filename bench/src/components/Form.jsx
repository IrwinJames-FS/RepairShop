import { Alert, Grid } from "@mui/material"
import { useState } from "react";
import { parseFormElements } from "../utils/formParser";

export const Form = ({onSubmit, action, onValidate, filter, children, ...props}) => {
	const [errorMessage, setErrorMessage] = useState(null);
	const handleSubmit = e => {
		e.preventDefault();
		const elements = parseFormElements(e.currentTarget.elements, filter ?? false);
		(async () => {
			try{
				const payload = onValidate ? onValidate(elements):elements;
				if(Object.keys(payload).length === 0) throw new Error("No changes were detected");
				if(!action) throw new Error("An Invalid method has been provided");
				console.log(payload);
				const response = await action(payload);
				onSubmit(response);
			} catch (error) {
				setErrorMessage(error.message);
			}
		})();
	}
	return (<form onSubmit={handleSubmit}><Grid container {...props}>
		{errorMessage && <Alert component={Grid} item xs={12} severity="error">{errorMessage}</Alert>}
		{children}
	</Grid></form>);
}