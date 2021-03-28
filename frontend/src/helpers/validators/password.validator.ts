import { ValidatorSet } from "../../typings/validators";

class PasswordValidator extends ValidatorSet<string> {
	public constructor() {
		super({
			default: (password) => password.trim().length >= 6,
		});
	}
}

const passwordValidator = new PasswordValidator();
export default passwordValidator;
