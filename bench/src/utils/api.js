import axios from "axios";
import { BASE_URL } from "../constants";
import qs from "qs";

/**
 * Just a convenience method to wrap axios
 * @param {*} sig 
 * @param {*} query 
 * @returns 
 */
export const getAllUsers = (sig, query) => axios.get(`${BASE_URL}/user${query && '?'+qs.stringify({...query})}`)
.then(resp=>resp.data);


export const getAllTickets = (sig, query={})=> axios.get(`${BASE_URL}/ticket?${qs.stringify({...query, sig})}`)
.then(resp=>resp.data);

export const getTicketComments = (sig, tid, query) => axios.get(`${BASE_URL}/ticket/${tid}/comment?${qs.stringify({...query, sig})}`)
.then(resp=>resp.data);



export const saveNewComment = (sig, tid, body) => axios.post(`${BASE_URL}/ticket/${tid}/comment?${qs.stringify({sig})}`, body)
.then(resp=>resp.data);

export const deleteTicket = (sig, tid) => axios.delete(`${BASE_URL}/ticket/${tid}?${qs.stringify({sig})}`);

export const deleteUser = (sig, uid) => axios.delete(`${BASE_URL}/user/${uid}?${qs.stringify({sig})}`);