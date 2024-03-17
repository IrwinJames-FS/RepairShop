import { Grid } from "@mui/material";
import { Auth } from "../components/Auth";
import { Topbar } from "../components/Topbar";
import { Users } from "../components/widgets/Users";


export const Dashboard = () => {
	return (<Auth>
		<Topbar/>
		<Grid container spacing={1} sx={{m:1}}>
			<Users xs={12} md={6}/>
		</Grid>
	</Auth>);
}