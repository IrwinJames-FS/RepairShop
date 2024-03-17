import { Add } from "@mui/icons-material";
import { Card, CardHeader, Grid, IconButton, Stack, Typography } from "@mui/material"

export const WidgetContainer = ({title, actions, children, ...props}) => {
	return (<Grid item {...props} sx={{p:1}}>
		<Card elevation={6} sx={{width: "100%", height: "100%"}}>
			<CardHeader title={<Stack direction="row" justifyContent="space-between" alignItems="center"><Typography color="white">{title}</Typography><Stack direction="row"/>{actions}</Stack>} sx={{bgcolor:"info.light"}}/>
			{children}
		</Card>
	</Grid>);
}