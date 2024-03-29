import { Person } from "@mui/icons-material"
import { AppBar, MenuItem, Toolbar, Typography } from "@mui/material"
import { useAuthentication } from "../../contexts/Authentication";
import { MenuButton } from "../MenuButton";
import { Link, useNavigate } from "react-router-dom";

export const Topbar = () => {
	const {user, logout} = useAuthentication();
	const navigate = useNavigate();
	const onLogout = () => {
		logout();
		navigate("/sign-in");
	}
	return (<>
	<AppBar enableColorOnDark>
		<Toolbar sx={{justifyContent: 'space-between'}}>
			<Typography component={Link} to="/" color="inherit" sx={{textDecoration:'none'}} variant="h4">Repair Shop</Typography>
			<Toolbar disableGutters>
				<MenuButton title={user.username} color="inherit" startIcon={<Person/>}>
					<MenuItem component={Link} to="/profile">Edit Profile</MenuItem>
					<MenuItem onClick={onLogout}>Log out</MenuItem>
				</MenuButton>
			</Toolbar>
		</Toolbar>
	</AppBar>
	<Toolbar/>
	</>)
}