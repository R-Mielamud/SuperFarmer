import { ValidatorSet } from "../../typings/validators";

class UsernameValidator extends ValidatorSet<string> {
	public constructor() {
		super({
			default: (value) => value.length <= 30,
		});
	}
}

const usernameValidator = new UsernameValidator();
export default usernameValidator;
