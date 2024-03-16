import { CssBaseline, ThemeProvider, createTheme, useMediaQuery } from "@mui/material";
import { useMemo } from "react";


export const Theme = ({children}) => {
	const isDark = useMediaQuery(`(prefers-color-scheme: dark)`);
	const theme = useMemo(()=>createTheme({
		palette: {
			mode: isDark ? `dark`:`light`
		}
	}), [isDark]);

	return (<ThemeProvider theme={theme}>
		<CssBaseline/>
		{children}
	</ThemeProvider>)
}