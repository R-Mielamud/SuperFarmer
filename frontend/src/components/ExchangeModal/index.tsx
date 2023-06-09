import React from "react";
import Modal from "../common/Modal";
import Exchanger, { OnExchangeToProps } from "../Exchanger";
import { TokenType } from "../GameToken";
import Button from "../common/Button";
import styles from "./exchangeModal.module.scss";

interface Props {
	open: boolean;
	gameState: WebApi.Entity.GameState;
	onExchange: Setter<OnExchangeToProps>;
	onClose: Callback;
}

const ExchangeModal: React.FC<Props> = ({ open, gameState, onExchange, onClose }) => {
	const onExchangeTo = (data: OnExchangeToProps) => {
		onExchange(data);
	};

	return (
		<Modal open={open}>
			<Exchanger
				first={{
					type: TokenType.Rabbit,
					count: 6,
					disabled: gameState.sheep < 1,
					onExchangeTo,
				}}
				second={{
					type: TokenType.Sheep,
					disabled: gameState.rabbits < 6,
					onExchangeTo,
				}}
			/>
			<Exchanger
				first={{
					type: TokenType.Sheep,
					count: 2,
					disabled: gameState.pigs < 1,
					onExchangeTo,
				}}
				second={{
					type: TokenType.Pig,
					disabled: gameState.sheep < 2,
					onExchangeTo,
				}}
			/>
			<Exchanger
				first={{
					type: TokenType.Pig,
					count: 3,
					disabled: gameState.cows < 1,
					onExchangeTo,
				}}
				second={{
					type: TokenType.Cow,
					disabled: gameState.pigs < 3,
					onExchangeTo,
				}}
			/>
			<Exchanger
				first={{
					type: TokenType.Cow,
					count: 2,
					disabled: gameState.horses < 1,
					onExchangeTo,
				}}
				second={{
					type: TokenType.Horse,
					disabled: gameState.cows < 2,
					onExchangeTo,
				}}
			/>
			<Exchanger
				first={{
					type: TokenType.Sheep,
					disabled: !gameState.has_small_dog,
					onExchangeTo,
				}}
				second={{
					type: TokenType.SmallDog,
					disabled: gameState.sheep < 1 || gameState.has_small_dog,
					onExchangeTo,
				}}
			/>
			<Exchanger
				first={{
					type: TokenType.Cow,
					disabled: !gameState.has_big_dog,
					onExchangeTo,
				}}
				second={{
					type: TokenType.BigDog,
					disabled: gameState.cows < 1 || gameState.has_big_dog,
					onExchangeTo,
				}}
			/>
			<Button primary onClick={onClose} className={styles.okButton}>
				OK
			</Button>
		</Modal>
	);
};

export default ExchangeModal;
