import React from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import Segment from "../../components/common/Segment";
import RegisterForm from "../../components/RegisterForm";
import { register } from "../LoginPage/login/actions";
import styles from "./register.module.scss";

const RegisterPage: React.FC = () => {
	const dispatch = useDispatch();

	const onSubmit = (data: WebApi.Requests.UserRegister) => {
		dispatch(register({ data }));
	};

	return (
		<div className="fill flex-center">
			<div className="fill-height flex-center column">
				<h2>Register to Super Farm</h2>
				<Segment className={styles.segment}>
					<RegisterForm onSubmit={onSubmit} />
					<div className="meta tip">
						Already playing Super Farm? <NavLink to="/login">Log in</NavLink>
					</div>
				</Segment>
			</div>
		</div>
	);
};

export default RegisterPage;
