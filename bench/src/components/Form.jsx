import { Alert, Grid } from "@mui/material"
import { useState } from "react";
import { parseFormElements } from "../utils/formParser";
import axios from "axios";

export const Form = ({onSubmit, action, method="post", onValidate, filter, children, ...props}) => {
	const [errorMessage, setErrorMessage] = useState(null);
	const handleSubmit = e => {
		e.preventDefault();
		const elements = parseFormElements(e.currentTarget.elements, filter ?? false);
		(async () => {
			try{
				const payload = onValidate ? onValidate(elements):elements;
				if(Object.keys(payload).length === 0) throw new Error("No changes were detected");
				const request = axios[method];
				if(!request) throw new Error("An Invalid method has been provided");
				const response = await request(action, payload);
				onSubmit(response);
			} catch (error) {
				setErrorMessage(error.response ? error.response.data.message:error.message);
			}
		})();
	}
	return (<form onSubmit={handleSubmit}><Grid container {...props}>
		{errorMessage && <Alert component={Grid} item xs={12} severity="error">{errorMessage}</Alert>}
		{children}
	</Grid></form>);
}