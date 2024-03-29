import { Button, CardActions, CardContent, CardHeader, Dialog, TextField, Typography } from "@mui/material";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useInputValue } from "../hooks/useInputValue";

const DialogContext = createContext({});

export const useDialog = () => useContext(DialogContext);

/**
 * This just replicates alert, confirm, and prompt popups
 * @param {} param0 
 * @returns 
 */
export const DialogContainer = ({children}) => {
	const [{type, title, text, confirmText, cancelText, value, resolve}, setState] = useState({type:0});
	const openDialog = useCallback((type, title, text, confirmText, cancelText, value) => new Promise((resolve) => {
		setState({type, title, text, confirmText, cancelText, value, resolve})
	}), [setState]);
	const alert = useCallback((...args)=>openDialog(1, ...args), [openDialog]);
	const confirm = useCallback((...args)=>openDialog(2, ...args), [openDialog]);
	const prompt = useCallback((title, text, value, ...args) => openDialog(3, title, text, ...args, value), [openDialog]);
	const onClose = useCallback(value=>{
		setState({type:0});
		resolve(value)
	}, [resolve]);
	return (<DialogContext.Provider value={{alert, confirm, prompt, onClose}}>
		{children}
		<Dialoger {...{type, title, text, confirmText, cancelText, value, onClose}}/>
	</DialogContext.Provider>);
}

const Dialoger = ({type, title, text, confirmText="Ok", cancelText="Cancel", value:val, onClose}) => {
	const open = useMemo(()=>!!type, [type]);
	const [value, onChange] = useInputValue(val);
	const cancel = ()=>onClose(false);
	const ok = ()=>onClose(type === 3 ? value:true);
	return (<Dialog {...{open}} fullWidth>
		<CardHeader {...{title, sx:{bgcolor:'info.light'}}}/>
		<CardContent>
			<Typography paragraph>{text}</Typography>
			{type === 3 && <TextField {...{value, onChange}} fullWidth/>}
		</CardContent>
		<CardActions sx={{justifyContent:'flex-end'}}>
			{type > 1 && <Button variant="contained" color="error" onClick={cancel}>{cancelText}</Button>}
			<Button variant="contained" color="info" sx={{color:"text.primary"}} onClick={ok}>{confirmText}</Button>
			
		</CardActions>
	</Dialog>)
}