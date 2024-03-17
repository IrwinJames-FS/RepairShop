import { Card, CardContent, CardHeader } from "@mui/material";
import { Main } from "../components/Main";
import { NoAuth } from "../components/NoAuth";
import { UserForm } from "../components/UserForm";
import { BASE_URL } from "../constants";
import { newUser } from "../utils/validators";
import { useAuthentication } from "../contexts/Authentication";

export const SignUp = () => {
	const { signIn } = useAuthentication();
	const onSubmit = (response) => {
		signIn(response.data);
	}
	return (<NoAuth><Main justifyContent="flex-start" alignItems="center">
		<Card sx={{width: {xs: 'calc(100dvw - 2rem)', md: '70dvw'}}}>
			<CardHeader title="Sign Up" sx={{bgcolor: "info.light"}}/>
			<CardContent>
				<UserForm method="post" action={`${BASE_URL}/sign-up`} onValidate={newUser} onSubmit={onSubmit} required/>
			</CardContent>
		</Card>
	</Main></NoAuth>)
}