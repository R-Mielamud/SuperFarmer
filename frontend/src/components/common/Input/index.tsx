import React, { useRef, useState } from "react";
import classList from "../../../helpers/classList.helper";
import Icon, { IconSettings } from "../Icon";
import styles from "./input.module.scss";

export enum IconPosition {
	Left,
	Right,
}

export enum InputType {
	Text = "text",
	Number = "number",
	Password = "password",
}

interface Props<T> {
	icon?: IconSettings;
	iconPosition?: IconPosition;
	iconClickable?: boolean;
	type?: InputType;
	fluid?: boolean;
	error?: boolean | string;
	value?: T;
	style?: React.CSSProperties;
	defaultValue?: T;
	placeholder?: string;
	iconOnClick?: Callback;
	onChange?: Setter<T>;
	onFocus?: Callback;
	onBlur?: Callback;
}

function Input<T = string | number>({
	icon,
	iconPosition = IconPosition.Right,
	iconClickable,
	type = InputType.Text,
	error,
	fluid,
	value,
	defaultValue,
	style,
	placeholder,
	iconOnClick,
	onChange,
	onFocus,
	onBlur,
}: Props<T>): JSX.Element {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [focused, setFocused] = useState<boolean>();

	const _onFocus = () => {
		if (onFocus) {
			onFocus();
		}

		setFocused(true);
	};

	const _onBlur = () => {
		if (onBlur) {
			onBlur();
		}

		setFocused(false);
	};

	const focus = () => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	};

	const iconClass = classList(
		{
			[styles.link]: iconClickable,
			[styles.error]: error,
		},
		styles.icon,
	);

	const containerClass = classList(
		{
			[styles.focused]: focused,
			[styles.fluid]: fluid,
			[styles.error]: error,
		},
		styles.container,
	);

	const inputClass = classList({}, styles.field);

	const iconComponent = icon ? (
		<Icon name={icon.name} type={icon.type} className={iconClass} onClick={iconOnClick} />
	) : null;

	const onChangeObject = onChange && {
		onChange: (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value as any),
	};

	return (
		<div>
			<div className={containerClass}>
				{iconPosition === IconPosition.Left && iconComponent}
				<div className={styles.wrapper} onClick={focus}>
					<input
						ref={inputRef}
						type={type}
						className={inputClass}
						value={value as any}
						defaultValue={defaultValue as any}
						placeholder={placeholder}
						{...onChangeObject}
						onFocus={_onFocus}
						onBlur={_onBlur}
						style={style}
					/>
				</div>
				{iconPosition === IconPosition.Right && iconComponent}
			</div>
			{typeof error === "string" ? <div className="meta error">{error}</div> : null}
		</div>
	);
}

export default Input;
