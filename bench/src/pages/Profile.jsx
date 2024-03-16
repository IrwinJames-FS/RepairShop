import { Alert, Button, Card, CardContent, CardHeader, Grid, Toolbar } from "@mui/material"
import { Main } from "../components/Main"
import { Cancel, Done } from "@mui/icons-material";
import { Auth } from "../components/Auth";
import { GField } from "../components/GField";
import { Topbar } from "../components/Topbar";
import { useAuthentication } from "../contexts/Authentication";
import { parseFormElements } from "../utils/formParser";
import { useState } from "react";

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
			<CardContent component="form" onSubmit={onSubmit}>
				<Grid container spacing="1rem">
					{errorMessage && <Grid item xs={12}><Alert severity="error">{errorMessage}</Alert></Grid>}
					<GField label="name" name="name" defaultValue={user.name} required grid={{xs:12, md: 6}}/>
					<GField label="username" name="username" defaultValue={user.username} required grid={{xs:12, md: 6}}/>
					<GField label="email" name="email" defaultValue={user.email} required grid={{xs: 12, md: 6}}/>
					<GField label="phone" name="phone" defaultValue={user.phone} required grid={{xs: 12, md: 6}}/>

					<GField label="password" name="password" grid={{xs: 12, md: 6}}/>
					<GField label="re-password" name="repassword" grid={{xs:12, md: 6}}/>
				</Grid>
				<Toolbar sx={{justifyContent: 'flex-end', gap: 1}} disableGutters>
					<Button variant="contained" type="reset" color="error" startIcon={<Cancel/>}>Reset</Button>
					<Button variant="contained" type="submit" color="success" startIcon={<Done/>}>Sign Up</Button>
				</Toolbar>
			</CardContent>
		</Card>
	</Main>
</Auth>)
}