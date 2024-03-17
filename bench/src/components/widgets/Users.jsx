import { Card, CardHeader, Dialog, DialogContent, DialogTitle, Grid, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { useAuthentication } from "../../contexts/Authentication"
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Edit } from "@mui/icons-material";
import { UserForm } from "../UserForm";

/**
 * This widget will not display to a base user. It will display only users that the specialist is working with to a specialist and will provided a full list to an admin
 */

const ActionCell = () => {
	return (<IconButton><Edit/></IconButton>)
}
export const Users = (props) => {
	const {user} = useAuthentication();
	const [users, setUsers] = useState([]);
	const [selectedUser, selectUser] = useState(null);
	const dialogOpen = useMemo(()=>!!selectedUser, [selectedUser]);
	const createNewUser = ()=>{
		selectUser({});
	}
	const onUserSubmit = (response) => {
		selectUser(null);
	}
	const cellSelector = user => {
		return () => selectUser(user);
	}
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
		},
		{
			field: '',
			renderCell: params => {
				console.log(params);
				return (<IconButton onClick={cellSelector(params.row)}><Edit/></IconButton>)
			}
		}
	]
	useEffect(()=>{
		if(!user || user.permission < 2) return;
		if(dialogOpen) return; //the dialog is open do nothing otherwise the dialog closed and the source info should be refreshed
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
	}, [user, setUsers, dialogOpen])
	if(!user || user.permission === 0) return null;
	if(user.permission === 1) return (<p>Not yet supported</p>);
	return (<>
	<Grid item {...props} sx={{p:1}}>
		<Card elevation={12}>
			<CardHeader title={<Stack direction="row" justifyContent="space-between" alignItems="center"><Typography color="white">Users</Typography><IconButton sx={{color:"white"}} onClick={createNewUser}><Add/></IconButton></Stack>} sx={{bgcolor: 'info.light'}}/>
			<DataGrid columns={columns} rows={users}/>
		</Card>
	</Grid>
	<Dialog open={dialogOpen} onClose={()=>selectUser(null)} fullWidth>
		<DialogTitle sx={{bgcolor:"info.light", color:"white"}}>Edit User</DialogTitle>
		<DialogContent>
			{selectedUser && <UserForm method={"id" in selectedUser ? "patch":"post"} action={`${BASE_URL}/user${"id" in selectedUser ? '/'+selectedUser.id:''}?sig=${user.sessionSignature}`} onSubmit={onUserSubmit} user={selectedUser}/>}
		</DialogContent>
	</Dialog>
	</>);

}