import { Navigate } from "react-router-dom";
import { useAuthentication } from "../contexts/Authentication"

export const NoAuth = ({children}) => {
	const { user } = useAuthentication();
	if(user) return (<Navigate to="/"/>);
	return (<>{children}</>);
}