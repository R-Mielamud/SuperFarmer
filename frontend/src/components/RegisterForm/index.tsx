import React, { useState } from "react";
import emailValidator from "../../helpers/validators/email.validator";
import namesValidator from "../../helpers/validators/names.validator";
import regsiterValidator from "../../helpers/validators/register.validator";
import usernameValidator from "../../helpers/validators/username.validator";
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
	const [firstNameValid, setFirstNameValid] = useState<boolean>(true);
	const [lastNameValid, setLastNameValid] = useState<boolean>(true);
	const dataValid = regsiterValidator.validate(data);

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

	const setFirstName = (firstName: string) => {
		addToData({ first_name: firstName });
		setFirstNameValid(true);
	};

	const setLastName = (lastName: string) => {
		addToData({ last_name: lastName });
		setLastNameValid(true);
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
				onBlur={() => setEmailValid(emailValidator.validate(data.email))}
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
				error={!usernameValid && "Username must be shorter than 30 characters"}
				onBlur={() => setUsernameValid(usernameValidator.validate(data.username))}
			/>
			<Input<string>
				fluid
				icon={{ name: "user" }}
				placeholder="First name"
				value={data.first_name ?? ""}
				error={!firstNameValid && "First name must be shorter than 20 characters"}
				onChange={setFirstName}
				onBlur={() => setFirstNameValid(data.first_name ? namesValidator.validate(data.first_name) : true)}
			/>
			<Input<string>
				fluid
				icon={{ name: "user" }}
				placeholder="Last name"
				value={data.last_name ?? ""}
				error={!lastNameValid && "Last name must be shorter than 20 characters"}
				onChange={setLastName}
				onBlur={() => setLastNameValid(data.last_name ? namesValidator.validate(data.last_name) : true)}
			/>
			<Button primary type={ButtonType.Submit} fluid disabled={!dataValid}>
				Register
			</Button>
		</Form>
	);
};

export default RegisterForm;
