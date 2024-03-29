import { Button, Grid, MenuItem, Stack } from "@mui/material"
import { Form } from "./Form"
import { GField } from "./GField"
import { Cancel, Done } from "@mui/icons-material"
import { useAuthentication } from "../contexts/Authentication"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useFormValues } from "../hooks/useFormValues"
import { useApi } from "../contexts/Api"
import { passthrough, validateNewTicket } from "../utils/validators"

const UserSelector = ({value, ...props}) => {
	const {user} = useAuthentication();
	const { getUsers } = useApi();
	const [users, setUsers] = useState([]);
	useEffect(() => {
		if(user.permission < 2) return;
		getUsers({fields: ['id', 'username']})
		.then(users =>setUsers(users))
		.catch((error)=>{
			console.log(error);
		})
	}, [user, getUsers]);
	return user.permission >= 2 ? (<GField value={users.length ? value:0} {...props} select>
		<MenuItem disabled value={0}>Select an Item</MenuItem>
		{users.map(({id, username})=><MenuItem value={id} key={id}>{username}</MenuItem>)}
	</GField>):null;
}

export const UserAssignment = ({permission, assignedTo, submittedBy, onChange}) => {
	return permission === 2 ? (<>
	<UserSelector {...{name:"assignedTo", value: assignedTo, onChange, grid:{xs:12, md:6}}}/>
	<UserSelector {...{name:"submittedBy", value: submittedBy, onChange, grid:{xs:12, md: 6}}}/>
	</>):(<><input type="hidden" defaultValue={assignedTo} name="assignedTo"/><input type="hidden" defaultValue={submittedBy} name="submittedBy"/></>)
}

const validators = [validateNewTicket, passthrough];
const enforceRequirement = [true, false];
export const TicketForm = ({onSubmit, ticket={}, ...props}) => {
	const {user} = useAuthentication();
	const api = useApi();
	const actions = useMemo(()=>[api.saveTicket, payload=>api.updateTicket(ticket.id, payload)], [api, ticket]);
	const index = useMemo(()=>Number(!!ticket.id), [ticket]);
	const action = useMemo(()=>actions[index], [actions, index]);
	const [validate, required] = useMemo(()=>[
		validators[index],
		enforceRequirement[index]
	],[index])

	//because TextFields being used as selects expects a controlled states I need a shim to handle this form so this should provide a similar behavior
	const [{ assignedTo, submittedBy}, updateValues, resetValues] = useFormValues({
		assignedTo: ticket.assignedTo ?? '',
		submittedBy: ticket.submittedBy ?? '',
	});
	console.log(ticket);
	const onValidate = useCallback((formValues) => validate({...formValues, assignedTo: assignedTo.length ? assignedTo:undefined, submittedBy}), [validate, assignedTo, submittedBy]);
	return (<Form {...{onValidate, onSubmit, action, spacing: 1, filter:ticket, ...props}}>
		{(ticket && "id" in ticket) && <input type="hidden" name="id" defaultValue={ticket.id}/>}
		<GField {...{name: "description", defaultValue:ticket.description, required, grid:{xs:12}}}/>
		<GField {...{name: "details", defaultValue:ticket.details, required, multiline:true, grid: {xs:12}}}/>
		<UserAssignment {...{permission:user.permission, assignedTo, submittedBy, onChange: updateValues}}/>
		<Grid item xs={12} container component={Stack} direction={{xs:"column", md:"row"}} justifyContent={{xs: "flex-start", md: "flex-end"}} gap={1}>
			<Button variant="contained" color="error" startIcon={<Cancel/>} type="reset" onClick={()=>{resetValues()}} sx={{color: "text.primary"}}>Reset</Button>
			<Button variant="contained" color="success" startIcon={<Done/>} type="submit" sx={{color: "text.primary"}}>Submit</Button>
		</Grid>
	</Form>);
}