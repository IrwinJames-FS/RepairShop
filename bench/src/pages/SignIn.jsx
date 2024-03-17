import { Alert, Button, Card, CardContent, CardHeader, Stack, TextField, Typography } from "@mui/material"
import { Main } from "../components/Main"
import axios from "axios";
import { BASE_URL } from "../constants";
import { useState } from "react";
import { buildStore } from "../utils/jsonStorage";
import { Link, Navigate } from "react-router-dom";
import { useAuthentication } from "../contexts/Authentication";
import { NoAuth } from "../components/NoAuth";
export const SignIn = () => {
	const [errorMessage, setErrorMessage] = useState(null);
	const { user, signIn } = useAuthentication();
	const handleSubmit = event => {
		event.preventDefault();
		const {username, password} = event.target.elements;
		const payload = {
			username: username.value,
			password: password.value
		}
		//Separate the 
		console.log("Breaking away");
		(async () => {
			const signInURL = `${BASE_URL}/sign-in`;
			try {
				const response = await axios.post(signInURL, payload);
				const user = response.data;
				signIn(user);
			} catch (error) {
				setErrorMessage(error.message);
			}
		})();
	}
	//TODO: - utilize history to redirect back to page that user came from
	return (<NoAuth><Main justifyContent="center" alignItems="center">
		<Card>
			<CardHeader title="Sign In"/>
			<CardContent component="form" onSubmit={handleSubmit}>
				<Stack>
					{errorMessage && <Alert variant="error">{errorMessage}</Alert>}
					<TextField label="username" required type="text" variant="standard" name="username" autoComplete="username"/>
					<TextField label="password" required type="password" variant="standard" name="password" autoComplete="current-password"/>
					<Button type="submit" variant="contained" color="success">Sign In</Button>
					<Button component={Link} to="/sign-up" color="info">Sign Up</Button>
				</Stack>
			</CardContent>
		</Card>
	</Main></NoAuth>);
}