import { Card, CardHeader, Grid } from "@mui/material";
import { useAuthentication } from "../../contexts/Authentication"
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { DataGrid } from "@mui/x-data-grid";

/**
 * This widget will not display to a base user. It will display only users that the specialist is working with to a specialist and will provided a full list to an admin
 */
const columns = [
	{
		field: 'name',
		flex: 1
	},
	{
		field: 'phone',
		width: 130
	},
	{
		field: 'email',
		width: 200
	}
]
export const Users = (props) => {
	const {user} = useAuthentication();
	const [users, setUsers] = useState([]);
	
	useEffect(()=>{
		if(!user || user.permission < 2) return;
		console.log(user);
		(async ()=>{
			try{
				const response = await axios.get(`${BASE_URL}/user?sig=${user.sessionSignature}`)
				console.log(response);
				const users = response.data;
				console.log(users);
				setUsers(users);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [user, setUsers])
	if(!user || user.permission === 0) return null;
	if(user.permission === 1) return (<p>Not yet supported</p>);
	return (<Card component={Grid} item {...props}>
		<CardHeader title="Users"/>
		<DataGrid columns={columns} rows={users}/>
	</Card>);
}