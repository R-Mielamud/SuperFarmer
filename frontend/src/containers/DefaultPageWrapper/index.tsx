import React from "react";
import Header from "../Header";

const DefaultPageWrapper: React.FC = ({ children }) => {
	return (
		<React.Fragment>
			<Header />
			{children}
		</React.Fragment>
	);
};

export default DefaultPageWrapper;
