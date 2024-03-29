import { Dialog, DialogContent, DialogTitle, IconButton, Tooltip } from "@mui/material";
import { useAuthentication } from "../../contexts/Authentication";
import { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Delete, Edit } from "@mui/icons-material";
import { UserForm } from "../UserForm";
import { WidgetContainer } from "./WidgetContainer";
import { useApi } from "../../contexts/Api";
import { useDialog } from "../../contexts/Dialogs";

/**
 * This widget will not display to a base user. It will display only users that the specialist is working with to a specialist and will provided a full list to an admin
 */

export const Users = (props) => {
	const {user} = useAuthentication();
	const [users, setUsers] = useState([]);
	const [selectedUser, selectUser] = useState(null);
	const { getUsers, deleteUser } = useApi();
	const { confirm } = useDialog();
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
				const deleteUsr = () => {
					confirm("Delete User?", "Are you sure this cannot be undone?", "I'm Sure", "Nevermind")
					.then(confirmed=>confirmed && deleteUser(params.id))
					.finally(()=>selectUser(s=>s===null ? undefined:null));
				}
				
				return (<>
				{user.user_id !== params.id && <Tooltip title="Edit User">
					<IconButton onClick={cellSelector(params.row)}><Edit/></IconButton>
				</Tooltip>}
				{user?.permission > 1 && user.user_id !== params.id && <Tooltip title="Delete User"><IconButton onClick={deleteUsr}><Delete/></IconButton></Tooltip>}
				</>)
			}
		}
	]
	useEffect(()=>{
		if(!user || user.permission < 2) return;
		if(selectedUser) return; //the dialog is open do nothing otherwise the dialog closed and the source info should be refreshed
		(async ()=>{
			try{
				const users = await getUsers();
				setUsers(users);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [user, setUsers, selectedUser, getUsers])
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
			{selectedUser && <UserForm {...{user:selectedUser, onSubmit:onUserSubmit}}/>}
		</DialogContent>
	</Dialog>
	</>);

}