import axios from "axios";
import { BASE_URL } from "../constants";
import qs from "qs";

/**
 * Just a convenience method to wrap axios
 * @param {*} sig 
 * @param {*} query 
 * @returns 
 */
export const getAllUsers = (sig, query={}) => axios.get(`${BASE_URL}/user?${qs.stringify({...query, sig})}`)
.then(resp=>resp.data);


export const getAllTickets = (sig, query={})=> axios.get(`${BASE_URL}/ticket?${qs.stringify({...query, sig})}`)
.then(resp=>resp.data);

