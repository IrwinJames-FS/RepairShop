import { Card, CardHeader, Grid } from "@mui/material";
import { useAuthentication } from "../../contexts/Authentication"

/**
 * This widget will not display to a base user. It will display only users that the specialist is working with to a specialist and will provided a full list to an admin
 */
export const Users = (props) => {
	const {user} = useAuthentication();
	if(!user || user.permission === 0) return null;
	if(user.permission === 1) return (<p>Not yet supported</p>);
	return (<Card component={Grid} item {...props}>
		<CardHeader title="Users"/>
	</Card>);
}