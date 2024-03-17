import { Add, Comment, Delete, Edit } from "@mui/icons-material"
import { Dialog, DialogContent, DialogTitle, IconButton, Tooltip } from "@mui/material"
import { WidgetContainer } from "./WidgetContainer"
import { useEffect, useMemo, useState } from "react"
import { TicketForm } from "../TicketForm"
import { useAuthentication } from "../../contexts/Authentication"
import { DataGrid } from "@mui/x-data-grid"
import { getAllTickets } from "../../utils/api"
import { BASE_URL } from "../../constants"
import { newTicket } from "../../utils/validators"
import { CommentsDialog } from "./CommentsDialog"

export const Tickets = (props) => {
	const [tickets, setTickets] = useState([]);
	const [selectedTicket, selectTicket] = useState(null);
	const [selectedCommentTicket, selectCommentTicket] = useState(null);

	const dialogOpen = useMemo(()=>!!selectedTicket, [selectedTicket]);
	const commentDialogOpen = useMemo(()=>!!selectedCommentTicket, [selectedCommentTicket]);
	const { user } = useAuthentication();
	const columns = [
		{field: 'description', flex:1},
		{field: 'createdAt', valueFormatter: ({value}) => {
			const date = new Date(Number(value));
			return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
		}},
		{
			field: '',
			width: user?.permission > 1 ? 140:100,
			renderCell: (params) => {
				const select = ()=>selectTicket(params.row);
				const selectComment = ()=>selectCommentTicket(params.row);
				return (<>
				<Tooltip title="Edit Ticket"><IconButton onClick={select} ><Edit/></IconButton></Tooltip>
				<Tooltip title="View Comments"><IconButton onClick={selectComment}><Comment/></IconButton></Tooltip>
				{user?.permission > 1 && <Tooltip title="Delete Ticket"><IconButton><Delete/></IconButton></Tooltip>}
				</>)
			}
		}
	]
	const createNewTicket = ()=>selectTicket({submittedBy:user.id});
	const onTicketSubmit = () => {
		selectTicket(null);
	}
	useEffect(()=>{
		if(selectedTicket) return; //If there is a ticket being presented no point in refereshing data but if this changes then there could be a new ticket or edited information 
		(async () => {
			try {
				const tickets = await getAllTickets(user.sessionSignature); 
				setTickets(tickets);
			} catch (error) {
				console.log(error);
				//I should do something here
			}
		})();
	}, [setTickets, user, selectedTicket]);
	return (<>
	<WidgetContainer {...{
		title: "Tickets",
		actions: <IconButton onClick={createNewTicket} sx={{color:"white"}}><Add/></IconButton>,
		...props
	}}>
		<DataGrid {...{columns, rows:tickets}}/>
	</WidgetContainer>
	<Dialog open={dialogOpen} onClose={()=>selectTicket(null)} fullWidth>
		<DialogTitle sx={{bgcolor:"info.light", color:"white"}}>Edit Ticket</DialogTitle>
		<DialogContent>
			{selectedTicket && <TicketForm method={"id" in selectedTicket ? "patch":"post"} action={`${BASE_URL}/ticket${"id" in selectedTicket ? '/'+selectedTicket.id:''}?sig=${user.sessionSignature}`} onSubmit={onTicketSubmit} onValidate={newTicket} ticket={selectedTicket}/>}
		</DialogContent>
	</Dialog>
	<CommentsDialog open={commentDialogOpen}  onClose={()=>selectCommentTicket(null)} ticketId={selectedCommentTicket?.id}/>
	</>);
}