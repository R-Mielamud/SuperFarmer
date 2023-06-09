export interface Validator<T> {
	(value: T): boolean;
}

export interface Validators<T> {
	[key: string]: Validator<T>;
}

export class BaseValidatorSet<T> {
	protected validators: Validators<T>;

	public constructor(validators: Validators<T>) {
		this.validators = validators;
	}
}

export class StrictValidatorSet<T> extends BaseValidatorSet<T> {
	public validate(value: T, validatorName: string = "default") {
		if (this.validators.hasOwnProperty(validatorName)) {
			const validator = this.validators[validatorName];
			return validator(value as T);
		}

		console.warn("No validator was found");
		return false;
	}
}

export class ValidatorSet<T> extends BaseValidatorSet<T> {
	public validate(value: T | undefined | null, validatorName: string = "default") {
		if (value === undefined || value === null) {
			return false;
		}

		if (this.validators.hasOwnProperty(validatorName)) {
			const validator = this.validators[validatorName];
			return validator(value as T);
		}

		console.warn("No validator was found");
		return false;
	}
}
