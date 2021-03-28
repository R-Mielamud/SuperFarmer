import React from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import Segment from "../../components/common/Segment";
import LoginForm from "../../components/LoginForm";
import { login } from "../LoginPage/login/actions";
import styles from "./login.module.scss";

const RegisterPage: React.FC = () => {
	const dispatch = useDispatch();

	const onSubmit = (data: WebApi.Requests.UserLogin) => {
		dispatch(login({ data }));
	};

	return (
		<div className="fill flex-center">
			<div className="fill-height flex-center column">
				<h2>Log in to Super Farm</h2>
				<Segment className={styles.segment}>
					<LoginForm onSubmit={onSubmit} />
					<div className="meta tip">
						Don&apos;t have account? <NavLink to="/register">Register</NavLink>
					</div>
				</Segment>
			</div>
		</div>
	);
};

export default RegisterPage;
