import React from "react";
import { useSelector } from "react-redux";
import getFullName from "../../helpers/user.helper";
import { RootState } from "../../typings/state";
import Button from "../common/Button";
import Modal from "../common/Modal";

interface Props {
	winner: WebApi.Entity.User;
	onClose?: Callback;
}

const WinnerModal: React.FC<Props> = ({ winner, onClose }) => {
	const { user } = useSelector((state: RootState) => state.auth);

	if (!user) {
		return null;
	}

	return (
		<Modal open>
			<h1>Game is finished!</h1>
			{user.id === winner.id ? (
				<h2>You are the winner! Congratulations!</h2>
			) : (
				<h2>The winner is {getFullName(winner)}</h2>
			)}
			<Button primary fluid onClick={onClose}>
				OK
			</Button>
		</Modal>
	);
};

export default WinnerModal;
