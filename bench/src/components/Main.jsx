import { Stack } from "@mui/material"

export const Main = ({justifyContent="flex-start", alignItems="stretch", direction="column", ...props}) => (<Stack component="main" sx={{height: '100dvh', width: '100dvw'}} {...{justifyContent, alignItems, ...props}}/>);