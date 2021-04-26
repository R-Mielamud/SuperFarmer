import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "react-router";
import ModalLoader from "../../components/common/ModalLoader";
import PrivateRoute from "../../components/common/PrivateRoute";
import PublicRoute from "../../components/common/PublicRoute";
import SocketIOBlacklist from "../../constansts/SocketIO";
import Game from "../../pages/Game";
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import Rooms from "../../pages/Rooms";
import { connect } from "../../services/socketLogic/actions";
import { RootState } from "../../typings/state";
import { loadProfile } from "../LoginPage/login/actions";

const Routing: React.FC = () => {
	const dispatch = useDispatch();

	const {
		auth: { isAuthorized, profileLoaded },
		socket: { ioConnected },
	} = useSelector((state: RootState) => state);

	const mustConnectIO = useMemo(() => !ioConnected && !SocketIOBlacklist.includes(window.location.pathname), [
		window.location.pathname,
		ioConnected,
	]);

	useEffect(() => {
		if (!profileLoaded) {
			dispatch(loadProfile());
		}

		if (mustConnectIO) {
			dispatch(connect());
		}
	}, []);

	if (!profileLoaded || mustConnectIO) {
		return <ModalLoader />;
	}

	return (
		<Switch>
			<PublicRoute restricted isAuthorized={isAuthorized} path="/login" exact component={Login} />
			<PublicRoute restricted isAuthorized={isAuthorized} path="/register" exact component={Register} />
			<PrivateRoute isAuthorized={isAuthorized} path="/" exact component={Rooms} />
			<PrivateRoute isAuthorized={isAuthorized} path="/game" exact component={Game} />
		</Switch>
	);
};

export default Routing;
