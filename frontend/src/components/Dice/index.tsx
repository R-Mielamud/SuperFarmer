import React, { useCallback, useEffect, useState } from "react";
import classList from "../../helpers/classList.helper";
import GameToken, { TokenType, Props as GameTokenProps } from "../GameToken";
import styles from "./dice.module.scss";

interface Props {
	initializedRoll: (
		roll: () => Promise<[TokenType, TokenType]>,
		setFirst: Setter<TokenType>,
		setSecond: Setter<TokenType>,
	) => void;
	className?: string;
	leftProps?: Omit<GameTokenProps, "type">;
	rightProps?: Omit<GameTokenProps, "type">;
}

const commonDiceVariants: TokenType[] = [
	TokenType.Rabbit,
	TokenType.Rabbit,
	TokenType.Rabbit,
	TokenType.Rabbit,
	TokenType.Rabbit,
	TokenType.Sheep,
	TokenType.Pig,
];

const firstDiceVariants: TokenType[] = [
	...commonDiceVariants,
	TokenType.Sheep,
	TokenType.Sheep,
	TokenType.Sheep,
	TokenType.Cow,
	TokenType.Wolf,
];

const secondDiceVariants: TokenType[] = [
	...commonDiceVariants,
	TokenType.Rabbit,
	TokenType.Rabbit,
	TokenType.Pig,
	TokenType.Horse,
	TokenType.Fox,
];

const diceTimeout = 50;
const firstMax = 20;
const secondMax = 30;

const Dice: React.FC<Props> = ({ initializedRoll, className, leftProps, rightProps }) => {
	const [firstToken, setFirstToken] = useState<TokenType>(TokenType.Rabbit);
	const [secondToken, setSecondToken] = useState<TokenType>(TokenType.Rabbit);
	const [firstInterval, setFirstInterval] = useState<NodeJS.Timeout | null>(null);
	const [secondInterval, setSecondInterval] = useState<NodeJS.Timeout | null>(null);
	const [firstDisabled, setFirstDisabled] = useState<boolean>(true);
	const [secondDisabled, setSecondDisabled] = useState<boolean>(true);

	const containerClass = classList(
		{
			[className ?? ""]: className,
		},
		styles.container,
	);

	const choose = function <T>(array: T[]): T {
		const rand = Math.random();
		const index = Math.floor(rand * array.length);
		return array[index];
	};

	const timeoutFunc = (
		id: NodeJS.Timeout,
		count: number,
		first: boolean,
		onFinish?: Callback | Setter<TokenType>,
	): [number, TokenType] => {
		const variants = first ? firstDiceVariants : secondDiceVariants;
		const max = first ? firstMax : secondMax;
		const token = choose<TokenType>(variants);

		if (first) {
			setFirstToken(token);
		} else {
			setSecondToken(token);
		}

		if (count >= max) {
			clearInterval(id);

			if (first) {
				setFirstInterval(null);
			} else {
				setSecondInterval(null);

				setTimeout(() => {
					setFirstDisabled(true);
					setSecondDisabled(true);
				}, 1000);
			}

			if (onFinish) {
				onFinish(token);
			}
		}

		return [count + 1, token];
	};

	const roll = useCallback(() => {
		return new Promise<[TokenType, TokenType]>((resolve) => {
			if (!firstInterval && !secondInterval) {
				let count1 = 1;
				let count2 = 1;
				let token1: TokenType | null = null;

				const id1 = setInterval(() => {
					[count1, token1] = timeoutFunc(id1, count1, true);
				}, diceTimeout);

				const id2 = setInterval(() => {
					[count2] = timeoutFunc(id2, count2, false, (second) => resolve([token1 as TokenType, second]));
				}, diceTimeout);

				setFirstInterval(id1);
				setSecondInterval(id2);
				setFirstDisabled(false);
				setSecondDisabled(false);
			}
		});
	}, [firstInterval, secondInterval]);

	useEffect(() => {
		initializedRoll(roll, setFirstToken, setSecondToken);
	}, [roll]);

	return (
		<div className={containerClass}>
			<GameToken {...leftProps} type={firstToken} disabled={firstDisabled} />
			<GameToken {...rightProps} type={secondToken} disabled={secondDisabled} />
		</div>
	);
};

export default Dice;
