import { ValidatorSet } from "../../typings/validators";
import emailValidator from "./email.validator";
import namesValidator from "./names.validator";
import passwordValidator from "./password.validator";
import usernameValidator from "./username.validator";

class RegisterValidator extends ValidatorSet<Partial<WebApi.Requests.UserRegister>> {
	public constructor() {
		super({
			default(data) {
				const passwordValid = passwordValidator.validate(data.password);
				const emailValid = emailValidator.validate(data.email);
				const usernameValid = usernameValidator.validate(data.username);
				const firstNameValid = namesValidator.validate(data.first_name);
				const lastNameValid = namesValidator.validate(data.last_name);

				return emailValid && passwordValid && usernameValid && firstNameValid && lastNameValid;
			},
		});
	}
}

const registerValidator = new RegisterValidator();
export default registerValidator;
