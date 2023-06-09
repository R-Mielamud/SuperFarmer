import React from "react";
import Dimmer from "../Dimmer";
import Loader from "../Loader";

interface Props {
	inverted?: boolean;
}

const ModalLoader: React.FC<Props> = ({ inverted }) => {
	return (
		<Dimmer inverted={inverted}>
			<Loader />
		</Dimmer>
	);
};

export default ModalLoader;
