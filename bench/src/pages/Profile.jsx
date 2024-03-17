import { Alert, Button, Card, CardContent, CardHeader, Grid, Toolbar } from "@mui/material"
import { Main } from "../components/Main"
import { Cancel, Done } from "@mui/icons-material";
import { Auth } from "../components/Auth";
import { GField } from "../components/GField";
import { Topbar } from "../components/Topbar";
import { useAuthentication } from "../contexts/Authentication";
import { parseFormElements } from "../utils/formParser";
import { useState } from "react";
import { UserForm } from "../components/UserForm";

export const Profile = () => {
	const {user} = useAuthentication();
	const [errorMessage, setErrorMessage] = useState(null);
	const onSubmit = e => {
		e.preventDefault();
		const formValues = parseFormElements(e.currentTarget.elements, user);

		//for now just do some validation if passwords change.
		if((formValues.password || formValues.repassword) && formValues.password !== formValues.repassword ) return setErrorMessage(`Password and Re-Password dont match`);

		(async () => {
			try {
				
			} catch (error) {
				return setErrorMessage(error.message);
			}
		})();
		
		console.log(formValues);
	}
	return (<Auth>
		<Topbar/>
		<Main justifyContent="flex-start" alignItems="center">
		<Card sx={{width: {xs: 'calc(100dvw - 2rem)', md: '70dvw'}}}>
			<CardHeader title="Edit Profile"/>
			<CardContent>
				<UserForm/>
			</CardContent>
		</Card>
	</Main>
</Auth>)
}