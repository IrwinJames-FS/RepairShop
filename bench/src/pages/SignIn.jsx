import { Button, Card, CardContent, CardHeader, Grid, Stack, Typography } from "@mui/material";
import { Main } from "../components/Main";
import { useAuthentication } from "../contexts/Authentication";
import { NoAuth } from "../components/NoAuth";
import { useApi } from "../contexts/Api";
import { Form } from "../components/Form";
import { Cancel, Done } from "@mui/icons-material";
import { validateSignIn } from "../utils/validators";
import { Link } from "react-router-dom";
import { GField } from "../components/GField";

export const SignIn = () => {
	const { login } = useAuthentication();
	const { signIn } = useApi();
	
	//TODO: - utilize history to redirect back to page that user came from
	return (<NoAuth><Main justifyContent="center" alignItems="center">
		<Card>
			<CardHeader title="Sign In" sx={{bgcolor: "info.light"}}/>
			<CardContent>
				<Stack>
					<Form action={signIn} onValidate={validateSignIn} onSubmit={login} spacing={1}>
						<GField {...{name: 'username', autoComplete:"username", grid:{xs:12}}} required/>
						<GField {...{name: 'password', type:"password", autoComplete:"current-password", grid:{xs:12}}} required/>
						<Grid item xs={12} container component={Stack} direction={{xs:"column", md:"row"}} justifyContent={{xs: "flex-start", md: "flex-end"}} gap={1}>
							<Button variant="contained" color="error" sx={{color:"text.primary"}} startIcon={<Cancel/>} type="reset">Reset</Button>
							<Button variant="contained" color="success" sx={{color:"text.primary"}} startIcon={<Done/>} type="submit">Login</Button>
						</Grid>
					</Form>
					<Typography paragraph>Not a member? <Button component={Link} to="/sign-up">Sign Up!</Button></Typography>
				</Stack>
			</CardContent>
		</Card>
	</Main></NoAuth>);
}