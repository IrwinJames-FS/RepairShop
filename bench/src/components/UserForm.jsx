import { Button, Grid, MenuItem, Select, Stack } from "@mui/material";
import { Form } from "./Form";
import { GField } from "./GField";
import { Cancel, Done } from "@mui/icons-material";
import { useAuthentication } from "../contexts/Authentication";

export const UserForm = ({action, method, onValidate, onSubmit, user={}, required}) => {
	const { user: modUser } = useAuthentication();
	return (<Form {...{onValidate, onSubmit, action, method, spacing: 1, filter:user}}>
		{(user && "id" in user) && <input type="hidden" name="id" defaultValue={user.id}/>}
		<GField {...{name: 'name', label: 'Name', required, grid:{xs:12, md: 6}, defaultValue:user.name}}/>
		<GField {...{name: 'username', label: 'Username', required, grid:{xs:12, md:6}, defaultValue: user.username}}/>
		<GField {...{name: 'email', label: 'Email', required, grid: {xs: 12, md: 6}, defaultValue: user.email}}/>
		<GField {...{name: 'phone', label: 'Phone', required, grid: {xs: 12, md: 6}, defaultValue: user.phone}}/>
		<GField {...{name: 'password', label: 'Password', type:"password", required, grid: {xs: 12, md: 6}}}/>
		<GField {...{name: 'repassword', label: 'Re-password', type:"password", required, grid: {xs: 12, md: 6}}}/>
		{modUser.permission === 2 && <Grid item xs={12}><Select label="Permission" defaultValue={user.permission ?? 0} variant="standard" fullWidth>
			<MenuItem value={0}>Basic</MenuItem>
			<MenuItem value={1}>Specialist</MenuItem>
			<MenuItem value={2}>Admin</MenuItem>
		</Select></Grid>}
		<Grid item xs={12} container component={Stack} direction={{xs:"column", md:"row"}} justifyContent={{xs: "flex-start", md: "flex-end"}} gap={1}>
			<Button variant="contained" color="error" startIcon={<Cancel/>} type="reset">Reset</Button>
			<Button variant="contained" color="success" startIcon={<Done/>} type="submit">Submit</Button>
		</Grid>
	</Form>);
}