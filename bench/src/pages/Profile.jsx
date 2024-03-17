import { Alert, Button, Card, CardContent, CardHeader, Grid, Toolbar } from "@mui/material"
import { Main } from "../components/Main"
import { Cancel, Done } from "@mui/icons-material";
import { Auth } from "../components/Auth";
import { GField } from "../components/GField";
import { Topbar } from "../components/Topbar";
import { useAuthentication } from "../contexts/Authentication";
import { parseFormElements } from "../utils/formParser";
import { useState } from "react";
import { UserForm } from "../components/UserForm";
import { BASE_URL } from "../constants";
import { updateUser } from "../utils/validators";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
	const {user} = useAuthentication();
	const navigate = useNavigate();
	const onSubmit = () => {
		navigate("/");
	}
	return (<Auth>
		<Topbar/>
		<Main justifyContent="flex-start" alignItems="center">
		<Card sx={{width: {xs: 'calc(100dvw - 2rem)', md: '70dvw'}}}>
			<CardHeader title="Edit Profile"/>
			<CardContent>
				<UserForm {...{user, method: "patch", action:`${BASE_URL}/user/${user?.id}?sig=${user?.sessionSignature}`, onValidate: updateUser, onSubmit}}/>
			</CardContent>
		</Card>
	</Main>
</Auth>)
}