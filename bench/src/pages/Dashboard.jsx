import { Grid } from "@mui/material";
import { Auth } from "../components/Auth";
import { Topbar } from "../components/Topbar";
import { Users } from "../components/widgets/Users";
import { Tickets } from "../components/widgets/Tickets";
import { useAuthentication } from "../contexts/Authentication";


export const Dashboard = () => {
	const { user } = useAuthentication();
	return (<Auth>
		<Topbar/>
		<Grid container>
			{user?.permission > 1 && <Users xs={12} md={6}/>}
			<Tickets {...{xs:12, md: user?.permission === 2 ? 6:undefined}}/>
		</Grid>
	</Auth>);
}