declare interface Validator<T> {
	(value: T): boolean;
}

declare type Validators<T, M extends string = "default"> = Record<"default" | M, Validator<T | undefined>>;
