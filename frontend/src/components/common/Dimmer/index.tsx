import React from "react";
import classList from "../../../helpers/classList.helper";
import styles from "./dimmer.module.scss";

interface Props {
	inverted?: boolean;
}

const Dimmer: React.FC<Props> = ({ children, inverted }) => {
	const dimmerClass = classList(
		{
			[styles.inverted]: inverted,
		},
		styles.dimmer,
	);

	return <div className={dimmerClass}>{children}</div>;
};

export default Dimmer;
