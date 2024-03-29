import { Grid, TextField } from "@mui/material";

export const GField = ({grid, label, name, type="text", children, ...props}) => <Grid item {...grid}><TextField label={label ?? name.charAt(0).toUpperCase() + name.slice(1)} type={type} name={name} variant="standard" fullWidth {...props}>{children}</TextField></Grid>