import { emailValidators } from "./email.validator";
import { passwordValidators } from "./password.validator";

export const validateRegisterData: Validator<Partial<WebApi.Requests.UserRegister>> = (data) => {
	if (!data) {
		return false;
	}

	const passwordValid = passwordValidators.default(data.password);
	const emailValid = emailValidators.default(data.email);
	const usernameValid = data.username && data.username.trim();

	return Boolean(emailValid && passwordValid && usernameValid);
};
