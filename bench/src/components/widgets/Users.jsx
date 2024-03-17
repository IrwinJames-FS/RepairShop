import { Card, CardHeader, Dialog, DialogContent, DialogTitle, Grid, IconButton, Stack, Toolbar, Tooltip, Typography } from "@mui/material";
import { useAuthentication } from "../../contexts/Authentication"
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Delete, Edit } from "@mui/icons-material";
import { UserForm } from "../UserForm";
import { WidgetContainer } from "./WidgetContainer";
import { deleteUser, getAllUsers } from "../../utils/api";

/**
 * This widget will not display to a base user. It will display only users that the specialist is working with to a specialist and will provided a full list to an admin
 */

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
			field: 'username',
		},
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
				const deleteUsr = () => deleteUser(user.sessionSignature, params.id)
				.finally(()=>selectUser(s=>s===null ? undefined:null));
				return (<>
				<Tooltip title="Edit User">
					<IconButton onClick={cellSelector(params.row)}><Edit/></IconButton>
				</Tooltip>
				{user?.permission > 1 && <Tooltip title="Delete User"><IconButton onClick={deleteUsr}><Delete/></IconButton></Tooltip>}
				</>)
			}
		}
	]
	useEffect(()=>{
		if(!user || user.permission < 2) return;
		
		if(selectedUser) return; //the dialog is open do nothing otherwise the dialog closed and the source info should be refreshed
		console.log("Fetching everything");
		(async ()=>{
			try{
				const users = await getAllUsers(user.sessionSignature);
				setUsers(users);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [user, setUsers, selectedUser])
	if(!user || user.permission === 0) return null;
	if(user.permission === 1) return (<p>Not yet supported</p>);
	return (<>
	<WidgetContainer {...{
		title: 'Users',
		actions: <IconButton sx={{color:"white"}} onClick={createNewUser}><Add/></IconButton>,
		...props
	}}>
		<DataGrid columns={columns} rows={users}/>
	</WidgetContainer>
	<Dialog open={dialogOpen} onClose={()=>selectUser(null)} fullWidth>
		<DialogTitle sx={{bgcolor:"info.light", color:"white"}}>Edit User</DialogTitle>
		<DialogContent>
			{selectedUser && <UserForm method={"id" in selectedUser ? "patch":"post"} action={`${BASE_URL}/user${"id" in selectedUser ? '/'+selectedUser.id:''}?sig=${user.sessionSignature}`} onSubmit={onUserSubmit} user={selectedUser}/>}
		</DialogContent>
	</Dialog>
	</>);

}