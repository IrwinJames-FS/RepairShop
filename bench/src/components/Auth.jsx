import { Navigate } from "react-router-dom";
import { useAuthentication } from "../contexts/Authentication"

export const Auth = ({children}) => {
	const { user } = useAuthentication();
	if(!user) return (<Navigate to="/sign-in"/>);
	return (<>{children}</>);
}