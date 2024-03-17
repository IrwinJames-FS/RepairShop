import { Button, Grid, MenuItem, Stack } from "@mui/material"
import { Form } from "./Form"
import { GField } from "./GField"
import { Cancel, Done } from "@mui/icons-material"
import { useAuthentication } from "../contexts/Authentication"
import { useEffect, useState } from "react"
import { getAllUsers } from "../utils/api"
import { useFormValues } from "../hooks/useFormValues"

const UserSelector = ({value, ...props}) => {
	const {user} = useAuthentication();
	const [users, setUsers] = useState([]);
	useEffect(() => {
		getAllUsers(user.sessionSignature, {fields:['id', 'username']})
		.then(users =>setUsers(users))
		.catch((error)=>{
			//I guess I should handle this error somehow.
			console.log(error);
		})
	});
	return (<GField value={users.length ? value:0} {...props} select>
		<MenuItem disabled value={0}>Select an Item</MenuItem>
		{users.map(({id, username})=><MenuItem value={id} key={id}>{username}</MenuItem>)}
	</GField>)
}
export const UserAssignment = ({permission, assignedTo, submittedBy, onChange}) => {
	return permission === 2 ? (<>
	<UserSelector {...{name:"assignedTo", value: assignedTo, onChange, grid:{xs:12, md:6}}}/>
	<UserSelector {...{name:"submittedBy", value: submittedBy, onChange, grid:{xs:12, md: 6}}}/>
	</>):(<><input type="hidden" defaultValue={assignedTo} name="assignedTo"/><input type="hidden" defaultValue={submittedBy} name="submittedBy"/></>)
}
export const TicketForm = ({action, method, onValidate:onV, onSubmit, ticket={}, required}) => {
	const {user} = useAuthentication();
	//because TextFields being used as selects expects a controlled states I need a shim to handle this form so this should provide a similar behavior
	const [{ assignedTo, submittedBy}, updateValues, resetValues] = useFormValues({
		assignedTo: ticket.assignedTo ?? '',
		submittedBy: ticket.submittedBy ?? '',
	});
	//again because I am using the above hook here I will validate the form values and return the appropriate object
	const onValidate = (formValues) => {
		console.log(typeof assignedTo)
		return {...formValues, assignedTo: assignedTo.length ? assignedTo:undefined, submittedBy}
	}
	return (<Form {...{onValidate, onSubmit, action, method, spacing: 1, filter:ticket}}>
		{(ticket && "id" in ticket) && <input type="hidden" name="id" defaultValue={ticket.id}/>}
		<GField {...{name: "description", defaultValue:ticket.description, required, grid:{xs:12}}}/>
		<GField {...{name: "details", defaultValue:ticket.details, required, multiline:true, grid: {xs:12}}}/>
		<UserAssignment {...{permission:user.permission, assignedTo, submittedBy, onChange: updateValues}}/>
		<Grid item xs={12} container component={Stack} direction={{xs:"column", md:"row"}} justifyContent={{xs: "flex-start", md: "flex-end"}} gap={1}>
			<Button variant="contained" color="error" startIcon={<Cancel/>} type="reset" onClick={()=>{resetValues()}}>Reset</Button>
			<Button variant="contained" color="success" startIcon={<Done/>} type="submit">Submit</Button>
		</Grid>
	</Form>);
}