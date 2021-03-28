import { ValidatorSet } from "../../typings/validators";

class LoginValidator extends ValidatorSet<Partial<WebApi.Requests.UserRegister>> {
	public constructor() {
		super({
			default(data) {
				const passwordValid = Boolean(data.password?.trim());
				const emailValid = Boolean(data.email?.trim());

				return emailValid && passwordValid;
			},
		});
	}
}

const loginValidator = new LoginValidator();
export default loginValidator;
