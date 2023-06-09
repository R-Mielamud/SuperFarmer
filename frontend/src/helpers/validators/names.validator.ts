import { ValidatorSet } from "../../typings/validators";

class NamesValidator extends ValidatorSet<string> {
	public constructor() {
		super({
			default: (value) => value.length <= 20,
		});
	}
}

const namesValidator = new NamesValidator();
export default namesValidator;
