import { Card, CardContent, CardHeader } from "@mui/material";
import { Main } from "../components/Main";
import { Auth } from "../components/Auth";
import { Topbar } from "../components/Topbar";
import { useAuthentication } from "../contexts/Authentication";
import { UserForm } from "../components/UserForm";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApi } from "../contexts/Api";

export const Profile = () => {
	const {user:{user_id}, update} = useAuthentication();
	const { getUser } = useApi();
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	useEffect(()=>{
		getUser(user_id)
		.then(user => {
			setUser(user);
			update('username', user.username);
		})
		.catch(error=>console.log(error));
	}, [getUser, user_id])
	return user && (<Auth>
		<Topbar/>
		<Main justifyContent="flex-start" alignItems="center">
		<Card sx={{width: {xs: 'calc(100dvw - 2rem)', md: '70dvw'}}}>
			<CardHeader title="Edit Profile"/>
			<CardContent>
				<UserForm {...{user, onSubmit: ()=>navigate('/')}}/>
			</CardContent>
		</Card>
	</Main>
</Auth>)
}