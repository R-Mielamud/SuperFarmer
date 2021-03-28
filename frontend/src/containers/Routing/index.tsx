import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "react-router";
import ModalLoader from "../../components/common/ModalLoader";
import PrivateRoute from "../../components/common/PrivateRoute";
import PublicRoute from "../../components/common/PublicRoute";
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import Rooms from "../../pages/Rooms";
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
			<PublicRoute restricted isAuthorized={isAuthorized} path="/login" exact component={Login} />
			<PublicRoute restricted isAuthorized={isAuthorized} path="/register" exact component={Register} />
			<PrivateRoute isAuthorized={isAuthorized} path="/" exact component={Rooms} />
		</Switch>
	);
};

export default Routing;
