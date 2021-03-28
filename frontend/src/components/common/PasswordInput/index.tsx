import React from "react";
import { IconName } from "@fortawesome/fontawesome-common-types";
import Input, { InputType } from "../Input";
import { IconSettings } from "../Icon";
import { passwordValidators } from "../../../helpers/validators/password.validator";

interface Props {
	value: string;
	hidden: boolean;
	valid?: boolean;
	fluid?: boolean;
	errorMessage?: string;
	setValue: Setter<string>;
	setHidden: Setter<boolean>;
	validator?: Validator<string>;
	setValid?: Setter<boolean>;
}

const PasswordInput: React.FC<Props> = ({
	value,
	valid,
	fluid,
	hidden,
	errorMessage = "Password must be minimum 6 characters long",
	setValid,
	setValue,
	setHidden,
}) => {
	const type: InputType = hidden ? InputType.Password : InputType.Text;
	const iconName: IconName = hidden ? "eye" : "eye-slash";
	const icon: IconSettings = { name: iconName };

	const onChange = (value: string) => {
		setValue(value);

		if (setValid) {
			setValid(true);
		}
	};

	return (
		<Input<string>
			fluid={fluid}
			type={type}
			icon={icon}
			iconClickable
			iconOnClick={() => setHidden(!hidden)}
			error={valid === false && errorMessage}
			value={value}
			placeholder="Password"
			onChange={onChange}
			onBlur={() => setValid && setValid(passwordValidators.default(value))}
		/>
	);
};

export default PasswordInput;
