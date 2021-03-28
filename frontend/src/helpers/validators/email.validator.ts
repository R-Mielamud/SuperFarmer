import validator from "validator";

export const emailValidators: Validators<string> = {
	default: (email) => Boolean(email && validator.isEmail(email.trim())),
};
