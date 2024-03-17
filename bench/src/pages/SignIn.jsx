import { Alert, Button, Card, CardContent, CardHeader, Stack, TextField } from "@mui/material";
import { Main } from "../components/Main";
import axios from "axios";
import { BASE_URL } from "../constants";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthentication } from "../contexts/Authentication";
import { NoAuth } from "../components/NoAuth";
export const SignIn = () => {
	const [errorMessage, setErrorMessage] = useState(null);
	const { signIn } = useAuthentication();
	const handleSubmit = event => {
		event.preventDefault();
		const {username, password} = event.target.elements;
		const payload = {
			username: username.value,
			password: password.value
		}
		//Separate the context

		const signInURL = `${BASE_URL}/sign-in`;
		return axios.post(signInURL, payload)
		.then(resp=>resp.data)
		.then(user=>signIn(user))
		.catch(error=>setErrorMessage(error.response.data.message));
	}
	//TODO: - utilize history to redirect back to page that user came from
	return (<NoAuth><Main justifyContent="center" alignItems="center">
		<Card>
			<CardHeader title="Sign In"/>
			<CardContent component="form" onSubmit={handleSubmit}>
				<Stack>
					{errorMessage && <Alert severity="error">{errorMessage}</Alert>}
					<TextField label="username" required type="text" variant="standard" name="username" autoComplete="username"/>
					<TextField label="password" required type="password" variant="standard" name="password" autoComplete="current-password"/>
					<Button type="submit" variant="contained" color="success">Sign In</Button>
					<Button component={Link} to="/sign-up" color="info">Sign Up</Button>
				</Stack>
			</CardContent>
		</Card>
	</Main></NoAuth>);
}