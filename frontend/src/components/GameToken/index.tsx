import React, { useMemo } from "react";
import classList from "../../helpers/classList.helper";
import { getLocalizedTokenStringType } from "../../helpers/gameToken.helper";
import styles from "./token.module.scss";

import tmp from "../../assets/game/tmp.svg";
import rabbit from "../../assets/game/rabbit.png";
import sheep from "../../assets/game/sheep.png";
import pig from "../../assets/game/pig.png";
import cow from "../../assets/game/cow.png";
import horse from "../../assets/game/horse.png";
import bigDog from "../../assets/game/big_dog.png";
import smallDog from "../../assets/game/small_dog.png";
import wolf from "../../assets/game/wolf.png";
import fox from "../../assets/game/fox.png";

export enum TokenType {
	Rabbit,
	Sheep,
	Pig,
	Cow,
	Horse,
	SmallDog,
	BigDog,
	Wolf,
	Fox,
}

export interface Props {
	type: TokenType;
	disabled?: boolean;
	main?: boolean;
	filled?: boolean;
	count?: number;
	width?: number;
	countUseX?: boolean;
	small?: boolean;
	className?: string;
}

const GameToken: React.FC<Props> = ({ type, disabled, main, filled, count, countUseX, width, small, className }) => {
	const image: string = useMemo(() => {
		switch (type) {
			case TokenType.Rabbit:
				return rabbit;
			case TokenType.Sheep:
				return sheep;
			case TokenType.Pig:
				return pig;
			case TokenType.Cow:
				return cow;
			case TokenType.Horse:
				return horse;
			case TokenType.BigDog:
				return bigDog;
			case TokenType.SmallDog:
				return smallDog;
			case TokenType.Fox:
				return fox;
			case TokenType.Wolf:
				return wolf;
			default:
				return tmp;
		}
	}, [type]);

	const stringType = useMemo(() => getLocalizedTokenStringType(type), [type]);

	const containerClass = classList(
		{
			[styles.disabled]: disabled && !filled ? true : false,
			[styles.main]: main,
			[styles.filled]: filled,
			[styles.small]: small,
			[className ?? ""]: className,
		},
		styles.container,
	);

	const countText: string = (count ?? 0) > 1 ? (countUseX ? `x${count}` : `+${(count ?? 0) - 1}`) : "";

	return (
		<div className={containerClass} {...(width ? { style: { width } } : {})} title={stringType}>
			<img src={image} className={styles.image} />
			<div className={styles.count}>{countText}</div>
		</div>
	);
};

export default GameToken;
