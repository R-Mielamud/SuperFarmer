import React, { useMemo } from "react";
import tmp from "../../assets/game/tmp.svg";
import classList from "../../helpers/classList.helper";
import styles from "./token.module.scss";

export enum TokenType {
	Rabbit,
	Sheep,
	Pig,
	Cow,
	Horse,
	SmallDog,
	BigDog,
}

interface Props {
	type: TokenType;
	disabled?: boolean;
	main?: boolean;
	filled?: boolean;
	count?: number;
	width?: number;
}

const GameToken: React.FC<Props> = ({ type, disabled, main, filled, count, width }) => {
	const image: string = useMemo(() => {
		switch (type) {
			default:
				return tmp;
		}
	}, [type]);

	const containerClass = classList(
		{
			[styles.disabled]: disabled && !filled ? true : false,
			[styles.main]: main,
			[styles.filled]: filled,
		},
		styles.container,
	);

	return (
		<div className={containerClass} {...(width ? { style: { width } } : {})}>
			<img src={image} className={styles.image} />
			<div className={styles.count}>{(count ?? 0) > 1 ? `x${count}` : ""}</div>
		</div>
	);
};

export default GameToken;
