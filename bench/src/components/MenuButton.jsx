import { Button, Menu } from "@mui/material"
import { useMenuAnchor } from "../hooks/useMenuAnchor"
import { ExpandLess, ExpandMore } from "@mui/icons-material";

export const MenuButton = ({children, title, onClick, ...props}) => {
	const [anchor, open, update, set] = useMenuAnchor();
	const oc = e=>{
		if(onClick) onClick();
		update(e);
	}
	return (<>
	<Button onClick={oc} {...props} endIcon={open ? <ExpandLess/>:<ExpandMore/>}>{title}</Button>
	<Menu anchorEl={anchor} open={open} onClose={()=>set(null)}>
		{children}
	</Menu>
	</>)
}