import { createContext, useCallback, useContext, useState } from "react";
import { buildStore } from "../utils/jsonStorage";

const {getItem, setItem, removeItem} = buildStore(sessionStorage);

const AuthenticationContext = createContext({});

export const useAuthentication = () => useContext(AuthenticationContext);

export const Authentication = ({children}) => {
	const [user, setUser] = useState(getItem("rpx-usr"));
	const login = useCallback((user) => {
		setItem('rpx-usr', user);
		setUser(user);
	}, [setUser]);

	const logout = useCallback(() => {
		removeItem('rpx-usr');
		setUser(null);
	}, [setUser]);

	const update = useCallback((key, value) => setUser(u=>{
		const nu = {...u, [key]:value};
		setItem('rpx-usr', nu);
		return nu;
	}),  [setUser])
	return (<AuthenticationContext.Provider value={{user, login, logout, update}}>
		{children}
	</AuthenticationContext.Provider>);
}