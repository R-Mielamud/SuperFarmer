import React from "react";
import styles from "./form.module.scss";

interface OwnProps {
	onSubmit?: Setter<React.FormEvent<HTMLFormElement>>;
}

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & OwnProps;

const Form: React.FC<Props> = ({ children, onSubmit, ...rest }) => {
	const _onSubmit: Setter<React.FormEvent<HTMLFormElement>> = (event) => {
		event.preventDefault();

		if (onSubmit) {
			onSubmit(event);
		}
	};

	return (
		<form onSubmit={_onSubmit} {...rest} className={styles.form}>
			{children}
		</form>
	);
};

export default Form;
