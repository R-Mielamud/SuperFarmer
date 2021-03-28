export default function classList(optionalClasses: Record<string, any>, ...otherClasses: string[]): string {
	const classes: string[] = [
		...Object.entries(optionalClasses).map(([key, value]) => (value ? key : "")),
		...otherClasses,
	];

	return classes.join(" ").trim();
}
