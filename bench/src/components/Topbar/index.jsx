import { ExpandLess, ExpandMore, Person } from "@mui/icons-material"
import { AppBar, MenuItem, Toolbar, Typography } from "@mui/material"
import { useAuthentication } from "../../contexts/Authentication";
import { MenuButton } from "../MenuButton";
import { Link } from "react-router-dom";

export const Topbar = () => {
	const {user} = useAuthentication();
	return (<>
	<AppBar enableColorOnDark>
		<Toolbar sx={{justifyContent: 'space-between'}}>
			<Typography component={Link} to="/" color="inherit" sx={{textDecoration:'none'}} variant="h4">Repair Shop</Typography>
			<Toolbar disableGutters>
				<MenuButton title={user.username} color="inherit" startIcon={<Person/>}>
					<MenuItem component={Link} to="/profile">Edit Profile</MenuItem>
				</MenuButton>
			</Toolbar>
		</Toolbar>
	</AppBar>
	<Toolbar/>
	</>)
}