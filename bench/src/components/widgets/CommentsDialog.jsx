import { Dialog, DialogTitle } from "@mui/material";
import { useState } from "react";

export const CommentsDialog = ({id, open, onClose}) => {
	const [comments, setComments] = useState([]);
	return (<Dialog {...{open, onClose}} fullWidth>
	<DialogTitle sx={{bgcolor:"info.light", color:"white"}}>Comments</DialogTitle>
</Dialog>);
}