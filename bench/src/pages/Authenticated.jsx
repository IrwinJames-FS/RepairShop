import { Navigate, Outlet } from "react-router-dom";
import { useAuthentication } from "../contexts/Authentication";
export const Authenticated = () => {
	const {user} = useAuthentication();
	if(!user) return (<Navigate to="/sign-in"/>); //first layer of protection
	return (<Outlet/>);
}