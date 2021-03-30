import React from "react";
import { useSelector } from "react-redux";
import Icon from "../../components/common/Icon";
import Logo from "../../components/common/Logo";
import { removeToken } from "../../helpers/token.helper";
import { RootState } from "../../typings/state";
import styles from "./header.module.scss";

const Header: React.FC = () => {
	const { user } = useSelector((state: RootState) => state.auth);

	if (!user) {
		return null;
	}

	const logout = () => {
		removeToken();
		window.location.replace("/login"); // Need reload
	};

	return (
		<div className={styles.header}>
			<div>
				<Logo className={styles.logo} />
				<h2>Super Farm</h2>
			</div>
			<div>
				<div className={styles.logout} onClick={logout}>
					<Icon name="sign-out-alt" />
					Log out
				</div>
			</div>
		</div>
	);
};

export default Header;
