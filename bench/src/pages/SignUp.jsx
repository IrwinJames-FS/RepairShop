import { Button, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { Main } from "../components/Main";
import { NoAuth } from "../components/NoAuth";
import { UserForm } from "../components/UserForm";
import { useAuthentication } from "../contexts/Authentication";
import { Link } from "react-router-dom";

export const SignUp = () => {
	const { login } = useAuthentication();
	const onSubmit = (response) => {
		login(response.data);
	}
	return (<NoAuth><Main justifyContent="flex-start" alignItems="center">
		<Card sx={{width: {xs: 'calc(100dvw - 2rem)', md: '70dvw'}}}>
			<CardHeader title="Sign Up" sx={{bgcolor: "info.light"}}/>
			<CardContent>
				<UserForm onSubmit={onSubmit}/>
				<Typography paragraph>Already a member? <Button component={Link} to="/sign-in">Sign In!</Button></Typography>
			</CardContent>
		</Card>
	</Main></NoAuth>)
}