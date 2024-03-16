import { Button, Card, CardContent, CardHeader, Stack, TextField, Typography } from "@mui/material"
import { Main } from "../components/Main"
import axios from "axios";
export const SignIn = () => {
	const handleSubmit = event => {
		event.preventDefault();
		console.log(event);
		const {username, password} = event.target.elements;
		const payload = {
			username: username.value,
			password: password.value
		}

	}
	return (<Main justifyContent="center" alignItems="center">
		<Card>
			<CardHeader title="Sign In"/>
			<CardContent component="form" onSubmit={handleSubmit}>
				<Stack>
					<TextField label="username" required type="text" variant="standard" name="username" autoComplete="username"/>
					<TextField label="password" required type="password" variant="standard" name="password" autoComplete="current-password"/>
					<Button type="submit" variant="contained" color="success">Sign In</Button>
				</Stack>
			</CardContent>
		</Card>
	</Main>);
}