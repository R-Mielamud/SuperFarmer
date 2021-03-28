import validator from "validator";
import { ValidatorSet } from "../../typings/validators";

class EmailValidator extends ValidatorSet<string> {
	public constructor() {
		super({
			default: (email) => validator.isEmail(email.trim()),
		});
	}
}

const emailValidator = new EmailValidator();
export default emailValidator;
