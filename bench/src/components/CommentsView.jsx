import { IconButton, List, ListItem, ListItemText, TextField } from "@mui/material"
import { useInputValue } from "../hooks/useInputValue"
import { Send } from "@mui/icons-material"

export const CommentView = ({comment}) => {
	return (<ListItem>
		<ListItemText primary={comment.comment}/>
	</ListItem>)
}

export const CommentEditView = ({comment={comment: ""}, index=-1, onSumbit}) => {
	const [value, onChange] = useInputValue(comment.comment);
	const send = ()=>onSumbit(value, index);
	return (<ListItem>
		<TextField {...{label:"Comment", value, onChange, variant:"standard", fullWidth:true, multiline:true}}/>
		<IconButton ><Send/></IconButton>
	</ListItem>);
}
export const CommentsView = ({comments}) => {
	const updateComments = (commentText, index) => {
		if(!~index) { //create a new comment

		}
		//update an existing comment
	}
	return (<List>
		{comments.map(comment=><CommentView key={comment.id}/>)}
		<CommentEditView/>
	</List>)
}