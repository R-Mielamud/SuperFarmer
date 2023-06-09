import React from "react";
import Header from "../Header";
import styles from "./default.module.scss";

const DefaultPageWrapper: React.FC = ({ children }) => {
	return (
		<div className={styles.container}>
			<Header />
			<div className={styles.page}>{children}</div>
		</div>
	);
};

export default DefaultPageWrapper;
