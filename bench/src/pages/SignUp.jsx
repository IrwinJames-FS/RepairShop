import { Button, Card, CardContent, CardHeader, Grid, Stack, TextField, Toolbar } from "@mui/material"
import { Main } from "../components/Main"
import { Cancel, Done } from "@mui/icons-material";
import { NoAuth } from "../components/NoAuth";
import { TxtField } from "../components/TxtField";
import { GField } from "../components/GField";

export const SignUp = () => {
	const onSubmit = e => {
		e.preventDefault();
	}
	return (<NoAuth><Main justifyContent="center" alignItems="center">
		<Card sx={{width: {xs: 'calc(100dvw - 2rem)', md: '70dvw'}}}>
			<CardHeader title="Sign Up"/>
			<CardContent component="form" onSubmit={onSubmit}>
				<Grid container spacing="1rem">
					<GField label="name" name="name" required grid={{xs:12, md: 6}}/>
					<GField label="username" name="username" required grid={{xs:12, md: 6}}/>
					<GField label="email" name="email" required grid={{xs: 12, md: 6}}/>
					<GField label="phone" name="phone" required grid={{xs: 12, md: 6}}/>
					<GField label="password" name="password" required grid={{xs: 12, md: 6}}/>
					<GField label="re-password" name="repassword" required grid={{xs:12, md: 6}}/>
				</Grid>
				<Toolbar sx={{justifyContent: 'flex-end', gap: 1}} disableGutters>
					<Button variant="contained" color="error" startIcon={<Cancel/>}>Cancel</Button>
					<Button variant="contained" type="submit" color="success" startIcon={<Done/>}>Sign Up</Button>
				</Toolbar>
			</CardContent>
		</Card>
	</Main></NoAuth>)
}