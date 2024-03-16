import { createContext, useContext, useState } from "react";
import { buildStore } from "../utils/jsonStorage";

const {getItem} = buildStore(sessionStorage);

const AuthenticationContext = createContext({});

export const useAuthentication = () => useContext(AuthenticationContext);

export const Authentication = ({children}) => {
	const [user, setUser] = useState(getItem("rpx-usr"));
	return (<AuthenticationContext.Provider value={{user, setUser}}>
		{children}
	</AuthenticationContext.Provider>);
}