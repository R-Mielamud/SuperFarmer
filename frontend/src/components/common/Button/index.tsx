import React from "react";
import classList from "../../../helpers/classList.helper";
import styles from "./button.module.scss";

export enum ButtonType {
	Default = "button",
	Submit = "submit",
}

interface Props {
	type?: ButtonType;
	fluid?: boolean;
	primary?: boolean;
	disabled?: boolean;
	className?: string;
	onClick?: Callback;
}

const Button: React.FC<Props> = ({
	type = ButtonType.Default,
	fluid,
	primary,
	disabled,
	className,
	children,
	onClick,
}) => {
	const buttonClass = classList(
		{
			[styles.primary]: primary,
			[styles.fluid]: fluid,
			[styles.disabled]: disabled,
			[className ?? ""]: className,
		},
		styles.button,
	);

	return (
		<button className={buttonClass} type={type} disabled={disabled} onClick={onClick}>
			{children}
		</button>
	);
};

export default Button;
