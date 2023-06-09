import React, { useCallback } from "react";
import GameToken, { TokenType } from "../GameToken";
import leftArrow from "../../assets/arrows/left.svg";
import rightArrow from "../../assets/arrows/right.svg";
import classList from "../../helpers/classList.helper";
import styles from "./exchanger.module.scss";

interface ExchangerPart {
	type: TokenType;
	count?: number;
}

export interface OnExchangeToProps {
	first: ExchangerPart;
	second: ExchangerPart;
}

interface ExchangerPartExtended extends ExchangerPart {
	disabled?: boolean;
	onExchangeTo: Setter<OnExchangeToProps>;
}

interface Props {
	first: ExchangerPartExtended;
	second: ExchangerPartExtended;
}

const exchangerPartExtendedToExchangerPart = (value: ExchangerPartExtended): ExchangerPart => ({
	type: value.type,
	count: value.count,
});

const Exchanger: React.FC<Props> = ({ first, second }) => {
	const getExchangeToProps = useCallback(
		(invert?: boolean) => {
			if (invert) {
				return {
					first: exchangerPartExtendedToExchangerPart(second),
					second: exchangerPartExtendedToExchangerPart(first),
				};
			} else {
				return {
					first: exchangerPartExtendedToExchangerPart(first),
					second: exchangerPartExtendedToExchangerPart(second),
				};
			}
		},
		[first, second],
	);

	const leftArrowClass = classList({ [styles.disabled]: first.disabled }, styles.arrow);
	const rightArrowClass = classList({ [styles.disabled]: second.disabled }, styles.arrow);

	return (
		<div className={styles.container}>
			<GameToken type={first.type} count={first.count} countUseX small />
			<div className={styles.arrows}>
				<img
					className={leftArrowClass}
					src={leftArrow}
					onClick={first.disabled ? () => null : () => first.onExchangeTo(getExchangeToProps(true))}
				/>
				<img
					className={rightArrowClass}
					src={rightArrow}
					onClick={second.disabled ? () => null : () => second.onExchangeTo(getExchangeToProps())}
				/>
			</div>
			<GameToken type={second.type} count={second.count} countUseX small />
		</div>
	);
};

export default Exchanger;
