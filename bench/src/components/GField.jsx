import { Grid, TextField } from "@mui/material";

export const GField = ({grid, ...props}) => <Grid item {...grid}><TextField variant="standard" fullWidth {...props}/></Grid>