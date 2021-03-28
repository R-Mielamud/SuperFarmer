import React, { useState } from "react";
import loginValidator from "../../helpers/validators/login.validator";
import Button, { ButtonType } from "../common/Button";
import Form from "../common/Form";
import Input from "../common/Input";
import PasswordInput from "../common/PasswordInput";

type Data = WebApi.Requests.UserLogin;

interface Props {
	onSubmit: Setter<Data>;
}

const LoginForm: React.FC<Props> = ({ onSubmit }) => {
	const [data, setData] = useState<Partial<Data>>({});
	const [passwordHidden, setPasswordHidden] = useState<boolean>(true);
	const dataValid = loginValidator.validate(data);

	const addToData = (props: Partial<Data>) => {
		setData({ ...data, ...props });
	};

	const login = () => {
		if (!dataValid) {
			return;
		}

		onSubmit(data as Data);
	};

	return (
		<Form onSubmit={login}>
			<Input<string>
				fluid
				icon={{ name: "at" }}
				placeholder="Email"
				value={data.email ?? ""}
				onChange={(email) => addToData({ email })}
			/>
			<PasswordInput
				fluid
				value={data.password ?? ""}
				setValue={(password) => addToData({ password })}
				hidden={passwordHidden}
				setHidden={setPasswordHidden}
			/>
			<Button primary type={ButtonType.Submit} fluid disabled={!dataValid}>
				Log in
			</Button>
		</Form>
	);
};

export default LoginForm;
