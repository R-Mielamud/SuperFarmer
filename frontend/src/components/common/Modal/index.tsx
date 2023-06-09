import React from "react";
import classList from "../../../helpers/classList.helper";
import Dimmer from "../Dimmer";
import styles from "./modal.module.scss";

interface OwnProps {
	open?: boolean;
	inverted?: boolean;
}

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & OwnProps;

const Modal: React.FC<Props> = ({ className, open = true, inverted, ...rest }) => {
	const modalClass = classList({ [className ?? ""]: className }, styles.modal);

	if (!open) {
		return null;
	}

	return (
		<Dimmer inverted={inverted}>
			<div className={modalClass} {...rest} />
		</Dimmer>
	);
};

export default Modal;
