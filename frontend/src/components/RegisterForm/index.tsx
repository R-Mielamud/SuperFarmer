import React, { useState } from "react";
import { emailValidators } from "../../helpers/validators/email.validator";
import { validateRegisterData } from "../../helpers/validators/register.validator";
import Button, { ButtonType } from "../common/Button";
import Form from "../common/Form";
import Input from "../common/Input";
import PasswordInput from "../common/PasswordInput";

type Data = WebApi.Requests.UserRegister;

interface Props {
	onSubmit: Setter<Data>;
}

const RegisterForm: React.FC<Props> = ({ onSubmit }) => {
	const [data, setData] = useState<Partial<Data>>({});
	const [emailValid, setEmailValid] = useState<boolean>(true);
	const [usernameValid, setUsernameValid] = useState<boolean>(true);
	const [passwordValid, setPasswordValid] = useState<boolean>(true);
	const [passwordHidden, setPasswordHidden] = useState<boolean>(true);
	const dataValid = validateRegisterData(data);

	const addToData = (props: Partial<Data>) => {
		setData({ ...data, ...props });
	};

	const register = () => {
		if (!dataValid) {
			return;
		}

		onSubmit(data as Data);
	};

	const setEmail = (email: string) => {
		addToData({ email });
		setEmailValid(true);
	};

	const setUsername = (username: string) => {
		addToData({ username });
		setUsernameValid(true);
	};

	return (
		<Form onSubmit={register}>
			<Input<string>
				fluid
				icon={{ name: "at" }}
				placeholder="Email"
				value={data.email ?? ""}
				onChange={setEmail}
				error={!emailValid}
				onBlur={() => setEmailValid(emailValidators.default(data.email))}
			/>
			<PasswordInput
				fluid
				value={data.password ?? ""}
				setValue={(password) => addToData({ password })}
				valid={passwordValid}
				setValid={setPasswordValid}
				hidden={passwordHidden}
				setHidden={setPasswordHidden}
			/>
			<Input<string>
				fluid
				icon={{ name: "user" }}
				placeholder="Username"
				value={data.username ?? ""}
				onChange={setUsername}
				error={!usernameValid}
				onBlur={() => setUsernameValid(Boolean(data.username))}
			/>
			<Input<string>
				fluid
				icon={{ name: "user" }}
				placeholder="First name"
				value={data.first_name ?? ""}
				onChange={(first_name) => addToData({ first_name })}
			/>
			<Input<string>
				fluid
				icon={{ name: "user" }}
				placeholder="Last name"
				value={data.last_name ?? ""}
				onChange={(last_name) => addToData({ last_name })}
			/>
			<Button primary type={ButtonType.Submit} fluid disabled={!dataValid}>
				Register
			</Button>
		</Form>
	);
};

export default RegisterForm;
