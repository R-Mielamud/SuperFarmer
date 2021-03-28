export const passwordValidators: Validators<string> = {
	default: (password) => Boolean(password && password.trim().length >= 6),
};
