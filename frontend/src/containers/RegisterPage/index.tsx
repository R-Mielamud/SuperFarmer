import React from "react";
import { useDispatch } from "react-redux";
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
				<h2>Register to SuperFarm</h2>
				<Segment className={styles.segment}>
					<RegisterForm onSubmit={onSubmit} />
				</Segment>
			</div>
		</div>
	);
};

export default RegisterPage;
