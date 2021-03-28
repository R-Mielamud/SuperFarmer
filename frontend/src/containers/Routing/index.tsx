import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "react-router";
import ModalLoader from "../../components/common/ModalLoader";
import PublicRoute from "../../components/common/PublicRoute";
import Register from "../../pages/Register";
import { RootState } from "../../typings/state";
import { loadProfile } from "../LoginPage/login/actions";

const Routing: React.FC = () => {
	const dispatch = useDispatch();
	const { isAuthorized, profileLoaded } = useSelector((state: RootState) => state.auth);

	useEffect(() => {
		if (!profileLoaded) {
			dispatch(loadProfile());
		}
	}, []);

	if (!profileLoaded) {
		return <ModalLoader inverted />;
	}

	return (
		<Switch>
			<PublicRoute restricted isAuthorized={isAuthorized} path="/register" exact component={Register} />
		</Switch>
	);
};

export default Routing;
