/*
Ultimately with a majority of routes requiring a token the api usage is dependent on the user. Perviously I was passing a signature to each api call however by using axios.create each time the user changes I can build out a better method.
*/
import { createContext, useCallback, useContext, useMemo } from "react";
import { useAuthentication } from "./Authentication";
import axios from "axios";
import { BASE_URL as baseURL } from "../constants";
import qs from 'qs';

const ApiContext = createContext({});

export const useApi = () => useContext(ApiContext);

/**
 * Just a method to recombine strings and arguments in the same order they are presented.
 * @param {TemplateStringsArray} a 
 * @param {string[]} b 
 */
const zip = (a, b) => Array.from(a).flatMap((n, i) => i < b.length ? [n, b[i]]:[n]).join('');
/**
 * 
 * @param {TemplateStringsArray} strings 
 * @param {Record<string, any>} query 
 * @returns 
 */
const qi = (strings, ...args) => {
	const last = args.length-1;
	if(~last && args[last]){
		args[last] = '?'+qs.stringify(args[last])
	}
	return zip(strings, args);
}

class ApiError extends Error {
	constructor(msg, status) {
		super(msg);
		this.status = status;
	}
}
const req = (method, args) => {
	console.log(args);
	return method(...args)
	.then(r=>r.data)
	.catch(error=>{
		if(error.response) throw new ApiError(error.response.data.message, error.response.status);
		throw  error;
	})
}
/**
 * Just a simple wrapper for all of axios rest methods.
 * @param {*} axe 
 */
const axier = user => ['get', 'post', 'patch', 'put', 'delete'].reduce((o,k)=>({...o, [k]:(...args)=>{
	const axe = axios.create(user ? {
		baseURL,
		headers: {
			'Authorization': user.token
		}
	}:{baseURL})
	return req(axe[k], args)
}}), {});

export const Api = ({children}) => {
	const { user } = useAuthentication();
	const axe = useMemo(()=>axier(user), [user]);
	const signIn = useCallback(body => axe.post(`/sign-in`, body), [axe]);
	const signUp = useCallback(body => axe.post(`/sign-up`, body), [axe]);
	const getUsers = useCallback(query => axe.get(qi`/user${query}`), [axe]);
	const getUser = useCallback((id, query) => axe.get(qi`./user/${id}${query}`), [axe]);
	const getTickets = useCallback(query => axe.get(qi`/ticket${query}`), [axe]);
	const getTicketComments = useCallback((tid, query) => axe.get(qi`/ticket/${tid}/comment${query}`), [axe]);
	const saveUser = useCallback((body)=>axe.post(`/user`, body), [axe]);
	const saveTicket = useCallback(body => axe.post(`/ticket`, body), [axe]);
	const saveComment = useCallback((tid, body) => axe.post(`/ticket/${tid}/comment`, body), [axe]);
	const updateUser = useCallback((uid, body) => axe.patch(`/user/${uid}`, body), [axe]);
	const updateTicket = useCallback((tid, body) => axe.patch(`/ticket/${tid}`, body), [axe]);
	const deleteTicket = useCallback((tid) => axe.delete(`/ticket/${tid}`), [axe]);
	const deleteUser = useCallback((uid) => axe.delete(`/user/${uid}`), [axe]);

	return (<ApiContext.Provider value={{
		signIn,
		signUp,
		getUsers,
		getUser,
		getTickets,
		getTicketComments,
		saveUser,
		saveTicket,
		saveComment,
		updateUser,
		updateTicket,
		deleteTicket,
		deleteUser,
	}}>
		{children}
	</ApiContext.Provider>)
}