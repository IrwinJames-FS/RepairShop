import { createContext, useContext, useState } from "react";
import { buildStore } from "../utils/jsonStorage";

const {getItem, setItem, removeItem} = buildStore(sessionStorage);

const AuthenticationContext = createContext({});

export const useAuthentication = () => useContext(AuthenticationContext);

export const Authentication = ({children}) => {
	const [user, setUser] = useState(getItem("rpx-usr"));
	const signIn = (user) => {
		setItem('rpx-usr', user);
		setUser(user);
	}
	const signOut = () => {
		removeItem('rpx-usr');
		setUser(null);
	}
	return (<AuthenticationContext.Provider value={{user, signIn, signOut}}>
		{children}
	</AuthenticationContext.Provider>);
}