import { Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemText, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { getTicketComments, saveNewComment } from "../../utils/api";
import { useAuthentication } from "../../contexts/Authentication";
import { Send } from "@mui/icons-material";
import { useInputValue } from "../../hooks/useInputValue";

export const CommentsDialog = ({ticketId, open, onClose}) => {
	const { user } = useAuthentication();
	const [comments, setComments] = useState([]);
	const [value, onChange, setValue] = useInputValue("");
	const save = () => {
		(async () => {
			console.log("Saving");
			try{
				const comments = await saveNewComment(user.sessionSignature, ticketId, {
					author: user.id,
					comment: value
				});
				console.log(comments);
				setValue("");
				setComments(comments);
			} catch (error) {
				console.log(error);
				console.log("do something to handle this error");
			}
			
		})();
	}
	useEffect(()=>{
		if(!ticketId) return;
		(async ()=>{
			try{
				const comments = await getTicketComments(user.sessionSignature, ticketId);
				setComments(comments);
			} catch (error) {
				console.log("do something different", error);

			}
		})();
	}, [setComments, ticketId, user]);
	
	return (<Dialog {...{open, onClose}} fullWidth>
	<DialogTitle sx={{bgcolor:"info.light", color:"white"}}>Comments</DialogTitle>
	<DialogContent>
		<List>
			{comments.map(({comment, id, createdAt, author:{username}})=><ListItem key={id}>
				<ListItemText primary={<pre>{comment}</pre>} secondary={`${username} @ ${dys(createdAt)}`}/>
			</ListItem>)}
			<ListItem>
				<TextField {...{label:"Comment", value, onChange, variant:"standard"}} multiline fullWidth/>
				<IconButton onClick={save}><Send/></IconButton>
			</ListItem>
		</List>
	</DialogContent>
</Dialog>);
}

const px = (n,p) => `${n}`.padStart(p, '0')
const dys = num => {
	const d = new Date(num);
	return `${px(d.getDate(),2)}/${px(d.getMonth(),2)}/${d.getFullYear()}`;
}