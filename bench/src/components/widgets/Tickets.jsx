import { Add, Comment, Delete, Edit } from "@mui/icons-material"
import { Dialog, DialogContent, DialogTitle, IconButton, Tooltip } from "@mui/material"
import { WidgetContainer } from "./WidgetContainer"
import { useEffect, useMemo, useState } from "react"
import { TicketForm } from "../TicketForm"
import { useAuthentication } from "../../contexts/Authentication"
import { DataGrid } from "@mui/x-data-grid"
import { CommentsDialog } from "./CommentsDialog"
import { useApi } from "../../contexts/Api"
import { useDialog } from "../../contexts/Dialogs"

export const Tickets = (props) => {
	const { getTickets, deleteTicket } = useApi();
	const [tickets, setTickets] = useState([]);
	const [selectedTicket, selectTicket] = useState(null);
	const [selectedCommentTicket, selectCommentTicket] = useState(null);
	const dialogOpen = useMemo(()=>!!selectedTicket, [selectedTicket]);
	const commentDialogOpen = useMemo(()=>!!selectedCommentTicket, [selectedCommentTicket]);
	const { user:{user_id, permission} } = useAuthentication();
	const { confirm } = useDialog();
	const columns = [
		{field: 'description', flex:1},
		{field: 'createdAt', valueFormatter: ({value}) => {
			const date = new Date(Number(value));
			return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
		}},
		{
			field: '',
			width: permission > 1 ? 140:100,
			renderCell: (params) => {
				const select = ()=>selectTicket(params.row);
				const selectComment = ()=>selectCommentTicket(params.row);
				const deleteTick = ()=>{
					return confirm("Delete Ticket?", "This cannot be undone", "I'm Sure", "Nevermind")
					.then(confirm=>{
						if(confirm) deleteTicket(params.id)
					})
					.finally(()=>selectTicket(s=>s===null ? undefined:null));
				}
				
				return (<>
				<Tooltip title="Edit Ticket"><IconButton onClick={select} ><Edit/></IconButton></Tooltip>
				<Tooltip title="View Comments"><IconButton onClick={selectComment}><Comment/></IconButton></Tooltip>
				{permission > 1 && <Tooltip title="Delete Ticket"><IconButton onClick={deleteTick}><Delete/></IconButton></Tooltip>}
				</>)
			}
		}
	]
	const createNewTicket = ()=>selectTicket({submittedBy:user_id});
	const onTicketSubmit = () => {
		selectTicket(null);
	}
	useEffect(()=>{
		if(selectedTicket) return; //If there is a ticket being presented no point in refereshing data but if this changes then there could be a new ticket or edited information 
		(async () => {
			try {
				const tickets = await getTickets(); 
				setTickets(tickets);
			} catch (error) {
				console.log(error);
				//I should do something here
			}
		})();
	}, [setTickets, selectedTicket, getTickets]);
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
			{selectedTicket && <TicketForm  onSubmit={onTicketSubmit} ticket={selectedTicket}/>}
		</DialogContent>
	</Dialog>
	<CommentsDialog open={commentDialogOpen}  onClose={()=>selectCommentTicket(null)} ticketId={selectedCommentTicket?.id}/>
	</>);
}